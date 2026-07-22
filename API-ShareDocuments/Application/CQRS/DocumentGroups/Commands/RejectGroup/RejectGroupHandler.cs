using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using Mapster;
using MediatR;

namespace Application.CQRS.DocumentGroups.Commands.RejectGroup
{
    internal class RejectGroupHandler : IRequestHandler<RejectGroupCommand, ApiResult<DocumentGroupDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public RejectGroupHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResult<DocumentGroupDto>> Handle(RejectGroupCommand request, CancellationToken cancellationToken)
        {
            var documentGroup = await _unitOfWork.DocumentGroupRepository.GetByIdAsync(request.Id);

            if (documentGroup is null || documentGroup.IsDeleted)
                return ApiResult<DocumentGroupDto>.Failure("Không tìm thấy nhóm chủ đề");
            if (documentGroup.Status != DocumentStatus.Pending)
                return ApiResult<DocumentGroupDto>.Failure("Chỉ có thể từ chối nhóm chủ đề đang ở trạng thái chờ duyệt");

            documentGroup.Status = DocumentStatus.Rejected;
            _unitOfWork.DocumentGroupRepository.Update(documentGroup);

            // TODO: Ghi ModerationLog (Action = Reject, Reason = request.Reason)
            // TODO: Gửi Notification real-time (SignalR) + Email cho chủ sở hữu nhóm - loại DocumentGroupRejected, kèm request.Reason

            await _unitOfWork.SaveChangesAsync();

            var dto = documentGroup.Adapt<DocumentGroupDto>();
            return ApiResult<DocumentGroupDto>.Success(dto);
        }
    }
}
