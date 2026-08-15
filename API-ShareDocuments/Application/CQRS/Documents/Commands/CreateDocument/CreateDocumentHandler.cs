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
        private readonly IDocumentConvertService _convertService;

        private static readonly HashSet<string> ConvertibleFileTypes = new(StringComparer.OrdinalIgnoreCase){ "docx", "pptx" };
        public CreateDocumentHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser, ISupabaseStorageService storageService, IDocumentConvertService convertService)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
            _storageService = storageService;
            _convertService = convertService;
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

            var file = request.File;
            var extension = Path.GetExtension(file.FileName).TrimStart('.').ToLowerInvariant();
            var isModerationBypass = _currentUser.IsAdmin || _currentUser.IsModerator;

            var document = request.Adapt<Document>();
            document.UserId = _currentUser.Id!.Value;
            document.Status = isModerationBypass ? DocumentStatus.Published : DocumentStatus.Pending;
            document.AccessLevel = isModerationBypass ? request.AccessLevel : AccessLevel.Free;
            document.IsDeleted = false;
            document.Tags = tags;
            document.FileName = file.FileName;
            document.FileType = extension;
            document.FileSizeBytes = file.Length;
            document.S3Key = string.Empty;
            document.ConversionStatus = FileConversionStatus.Pending;

            await _unitOfWork.DocumentRepository.AddAsync(document);
            await _unitOfWork.SaveChangesAsync();

            var folder = $"documents/{document.Id}";
            var originalKey = $"{folder}/original.{extension}";

            using var fileMemory = new MemoryStream();
            await using (var readStream = file.OpenReadStream())
            {
                await readStream.CopyToAsync(fileMemory, cancellationToken);
            }

            try
            {
                fileMemory.Position = 0;
                await _storageService.UploadAsync(fileMemory, originalKey, file.ContentType, cancellationToken);
            }
            catch
            {
                _unitOfWork.DocumentRepository.Delete(document);
                await _unitOfWork.SaveChangesAsync();
                return ApiResult<DocumentDetailDto>.Failure("Tải file lên hệ thống thất bại. Vui lòng thử lại");
            }

            document.S3Key = originalKey;

            var conversionStatus = FileConversionStatus.Failed;
            string? previewPdfKey = null;
            string? thumbnailKey = null;

            try
            {
                Stream pdfStream;

                if (extension == "pdf")
                {
                    previewPdfKey = originalKey;
                    fileMemory.Position = 0;
                    pdfStream = fileMemory;
                }
                else if (ConvertibleFileTypes.Contains(extension))
                {
                    fileMemory.Position = 0;
                    pdfStream = await _convertService.ConvertPdfAsync(fileMemory, file.FileName, cancellationToken);

                    previewPdfKey = $"{folder}/converted.pdf";
                    pdfStream.Position = 0;
                    await _storageService.UploadAsync(pdfStream, previewPdfKey, "application/pdf", cancellationToken);
                }
                else
                {
                    pdfStream = Stream.Null;
                }

                if (pdfStream != Stream.Null)
                {
                    pdfStream.Position = 0;
                    await using var thumbnailStream = await _convertService.GenerateThumbnailAsync(pdfStream, cancellationToken);

                    thumbnailKey = $"{folder}/thumbnail.jpg";
                    thumbnailStream.Position = 0;
                    await _storageService.UploadAsync(thumbnailStream, thumbnailKey, "image/jpeg", cancellationToken);

                    conversionStatus = FileConversionStatus.Completed;
                }
            }
            catch
            {
                conversionStatus = FileConversionStatus.Failed;
            }

            document.PreviewPdfKey = previewPdfKey;
            document.ThumbnailKey = thumbnailKey;
            document.ConversionStatus = conversionStatus;

            _unitOfWork.DocumentRepository.Update(document);
            await _unitOfWork.SaveChangesAsync();

            document.Subject = subject;

            var documentDto = document.Adapt<DocumentDetailDto>();
            return ApiResult<DocumentDetailDto>.Success(documentDto);
        }
    }
}
