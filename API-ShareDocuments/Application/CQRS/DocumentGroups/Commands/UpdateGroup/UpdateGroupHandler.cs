using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.DocumentGroups.Commands.UpdateGroup
{
    public class UpdateGroupHandler : IRequestHandler<UpdateGroupCommand, ApiResult<DocumentGroupDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public UpdateGroupHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<DocumentGroupDto>> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<DocumentGroupDto>.Failure("Người dùng chưa đăng nhập");

            var documentGroup = await _unitOfWork.DocumentGroupRepository.GetByIdAsync(request.Id);

            if (documentGroup is null || documentGroup.IsDeleted)
                return ApiResult<DocumentGroupDto>.Failure("Không tìm thấy nhóm chủ đề");

            if (documentGroup.UserId != _currentUser.Id.Value)
                return ApiResult<DocumentGroupDto>.Failure("Bạn không có quyền chỉnh sửa nhóm chủ đề này");

            request.Adapt(documentGroup);
            _unitOfWork.DocumentGroupRepository.Update(documentGroup);

            var dto = documentGroup.Adapt<DocumentGroupDto>();
            return ApiResult<DocumentGroupDto>.Success(dto);
        }
    }
}
