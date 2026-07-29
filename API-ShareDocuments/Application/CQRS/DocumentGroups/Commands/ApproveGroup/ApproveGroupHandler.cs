using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.DocumentGroups.Commands.ApproveGroup
{
    public class ApproveGroupHandler : IRequestHandler<ApproveGroupCommand, ApiResult<DocumentGroupDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public ApproveGroupHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResult<DocumentGroupDto>> Handle(ApproveGroupCommand request, CancellationToken cancellationToken)
        {
            var documentGroup = await _unitOfWork.DocumentGroupRepository.GetByIdAsync(request.Id);

            if (documentGroup is null || documentGroup.IsDeleted)
                return ApiResult<DocumentGroupDto>.Failure("Không tìm thấy nhóm chủ đề.");

            if (documentGroup.Status != DocumentStatus.Pending)
                return ApiResult<DocumentGroupDto>.Failure("Chỉ có thể duyệt nhóm chủ đề đang ở trạng thái chờ duyệt.");

            documentGroup.Status = DocumentStatus.Published;
            _unitOfWork.DocumentGroupRepository.Update(documentGroup);

            var pendingDocuments = await _unitOfWork.DocumentRepository
                .GetByCondition(d => d.GroupId == documentGroup.Id && d.Status == DocumentStatus.Pending && !d.IsDeleted)
                .ToListAsync(cancellationToken);

            foreach (var document in pendingDocuments)
            {
                document.Status = DocumentStatus.Published;
                _unitOfWork.DocumentRepository.Update(document);
            }

            var documentGroupDto = documentGroup.Adapt<DocumentGroupDto>();
            return ApiResult<DocumentGroupDto>.Success(documentGroupDto);
        }
    }
}
