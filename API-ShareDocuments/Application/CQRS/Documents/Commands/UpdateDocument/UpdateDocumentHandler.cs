using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Documents.Commands.UpdateDocument
{
    public class UpdateDocumentHandler : IRequestHandler<UpdateDocumentCommand, ApiResult<DocumentDetailDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public UpdateDocumentHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<DocumentDetailDto>> Handle(UpdateDocumentCommand request, CancellationToken cancellationToken)
        {
            var document = await _unitOfWork.DocumentRepository
                .GetByCondition(d => d.Id == request.Id)
                .Include(d => d.Tags)
                .FirstOrDefaultAsync(cancellationToken);

            if (document is null || document.IsDeleted)
                return ApiResult<DocumentDetailDto>.Failure("Không tìm thấy tài liệu");

            if (document.UserId != _currentUser.Id!.Value)
                return ApiResult<DocumentDetailDto>.Failure("Bạn không có quyền chỉnh sửa tài liệu này");

            var subject = await _unitOfWork.SubjectRepository.GetByIdAsync(request.SubjectId);
            if (subject is null)
                return ApiResult<DocumentDetailDto>.Failure("Môn học không tồn tại");

            if (request.GroupId.HasValue)
            {
                var group = await _unitOfWork.DocumentGroupRepository.GetByIdAsync(request.GroupId.Value);
                if (group is null || group.IsDeleted)
                    return ApiResult<DocumentDetailDto>.Failure("Nhóm chủ đề không tồn tại");
            }

            var tags = new List<Domain.Entities.Tag>();
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

            request.Adapt(document);
            document.Tags = tags;
            document.AccessLevel = isModerationBypass ? request.AccessLevel : document.AccessLevel;

            _unitOfWork.DocumentRepository.Update(document);
            await _unitOfWork.SaveChangesAsync();

            document.Subject = subject;
            var documentDto = document.Adapt<DocumentDetailDto>();
            return ApiResult<DocumentDetailDto>.Success(documentDto);
        }
    }
}