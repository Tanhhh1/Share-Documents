using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Documents.Commands.UpdateDocument
{
    internal class UpdateDocumentHandler : IRequestHandler<UpdateDocumentCommand, ApiResult<DocumentDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public UpdateDocumentHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<DocumentDto>> Handle(UpdateDocumentCommand request, CancellationToken cancellationToken)
        {
            var document = await _unitOfWork.DocumentRepository
                .GetByCondition(d => d.Id == request.Id)
                .Include(d => d.Tags)
                .FirstOrDefaultAsync(cancellationToken);

            if (document is null || document.IsDeleted)
                return ApiResult<DocumentDto>.Failure("Không tìm thấy tài liệu");

            if (document.UserId != _currentUser.Id!.Value)
                return ApiResult<DocumentDto>.Failure("Bạn không có quyền chỉnh sửa tài liệu này");

            var subject = await _unitOfWork.SubjectRepository.GetByIdAsync(request.SubjectId);
            if (subject is null)
                return ApiResult<DocumentDto>.Failure("Môn học không tồn tại");

            if (request.GroupId.HasValue)
            {
                var group = await _unitOfWork.DocumentGroupRepository.GetByIdAsync(request.GroupId.Value);
                if (group is null || group.IsDeleted)
                    return ApiResult<DocumentDto>.Failure("Nhóm chủ đề không tồn tại");
            }

            var tags = new List<Domain.Entities.Tag>();
            if (request.TagIds.Count > 0)
            {
                tags = await _unitOfWork.TagRepository
                    .GetByCondition(t => request.TagIds.Contains(t.Id) && !t.IsDeleted)
                    .ToListAsync(cancellationToken);

                if (tags.Count != request.TagIds.Distinct().Count())
                    return ApiResult<DocumentDto>.Failure("Một hoặc nhiều tag không tồn tại");
            }

            request.Adapt(document);
            document.Tags = tags;

            _unitOfWork.DocumentRepository.Update(document);
            await _unitOfWork.SaveChangesAsync();

            document.Subject = subject;
            var documentDto = document.Adapt<DocumentDto>();
            return ApiResult<DocumentDto>.Success(documentDto);
        }
    }
}
