using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Domain.Enums;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Documents.Commands.CreateDocument
{
    public class CreateDocumentHandler : IRequestHandler<CreateDocumentCommand, ApiResult<DocumentDetailDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        private readonly ISupabaseStorageService _storageService;

        public CreateDocumentHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser, ISupabaseStorageService storageService)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
            _storageService = storageService;
        }

        public async Task<ApiResult<DocumentDetailDto>> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
        {
            var subject = await _unitOfWork.SubjectRepository.GetByIdAsync(request.SubjectId);
            if (subject is null)
                return ApiResult<DocumentDetailDto>.Failure("Môn học không tồn tại");

            if (request.GroupId.HasValue)
            {
                var group = await _unitOfWork.DocumentGroupRepository.GetByIdAsync(request.GroupId.Value);
                if (group is null || group.IsDeleted)
                    return ApiResult<DocumentDetailDto>.Failure("Nhóm chủ đề không tồn tại");
            }

            var tags = new List<Tag>();
            if (request.TagIds.Count > 0)
            {
                var distinctTagIds = request.TagIds.Distinct().ToList();

                tags = await _unitOfWork.TagRepository
                    .GetByCondition(t => distinctTagIds.Contains(t.Id) && !t.IsDeleted)
                    .ToListAsync(cancellationToken);

                if (tags.Count != distinctTagIds.Count)
                    return ApiResult<DocumentDetailDto>.Failure("Một hoặc nhiều tag không tồn tại");
            }

            var isModerationBypass = _currentUser.IsAdmin || _currentUser.IsModerator;
            var status = isModerationBypass ? DocumentStatus.Published : DocumentStatus.Pending;
            var accessLevel = isModerationBypass ? request.AccessLevel : AccessLevel.Free;

            var document = request.Adapt<Document>();
            document.UserId = _currentUser.Id!.Value;
            document.Status = status;
            document.AccessLevel = accessLevel;
            document.IsDeleted = false;
            document.Tags = tags;

            await _unitOfWork.DocumentRepository.AddAsync(document);
            await _unitOfWork.SaveChangesAsync();

            var uploadedKeys = new List<string>();
            var documentFiles = new List<DocumentFile>();

            try
            {
                foreach (var file in request.Files)
                {
                    var extension = Path.GetExtension(file.FileName);
                    var storageKey = $"documents/{document.Id}/{Guid.NewGuid()}{extension}";

                    await using var stream = file.OpenReadStream();
                    await _storageService.UploadAsync(stream, storageKey, file.ContentType, cancellationToken);
                    uploadedKeys.Add(storageKey);

                    documentFiles.Add(new DocumentFile
                    {
                        DocumentId = document.Id,
                        FileName = file.FileName,
                        FileType = extension.TrimStart('.').ToLowerInvariant(),
                        FileSizeBytes = file.Length,
                        S3Key = storageKey
                    });
                }
            }
            catch
            {
                foreach (var key in uploadedKeys)
                    await _storageService.DeleteAsync(key, cancellationToken);
                throw;
            }

            foreach (var documentFile in documentFiles)
                await _unitOfWork.DocumentFileRepository.AddAsync(documentFile);

            await _unitOfWork.SaveChangesAsync();

            document.Subject = subject;
            document.Files = documentFiles;

            var documentDto = document.Adapt<DocumentDetailDto>();
            return ApiResult<DocumentDetailDto>.Success(documentDto);
        }
    }
}
