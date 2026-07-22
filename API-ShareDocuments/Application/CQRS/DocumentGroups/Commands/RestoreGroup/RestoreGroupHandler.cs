using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.DocumentGroups.Commands.RestoreGroup
{
    public class RestoreGroupHandler : IRequestHandler<RestoreGroupCommand, ApiResult<DocumentGroupDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public RestoreGroupHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<DocumentGroupDto>> Handle(RestoreGroupCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<DocumentGroupDto>.Failure("Người dùng chưa đăng nhập");

            var documentGroup = await _unitOfWork.DocumentGroupRepository.GetByIdAsync(request.Id);
            if (documentGroup is null)
                return ApiResult<DocumentGroupDto>.Failure("Không tìm thấy nhóm chủ đề");
            if (documentGroup.UserId != _currentUser.Id.Value)
                return ApiResult<DocumentGroupDto>.Failure("Bạn không có quyền khôi phục nhóm chủ đề này");
            if (!documentGroup.IsDeleted)
                return ApiResult<DocumentGroupDto>.Failure("Nhóm chủ đề hiện không ở trạng thái bị xóa");

            documentGroup.IsDeleted = false;
            documentGroup.DeletedAt = null;
            _unitOfWork.DocumentGroupRepository.Update(documentGroup);

            var childDocuments = await _unitOfWork.DocumentRepository
                .GetByCondition(d => d.GroupId == documentGroup.Id && d.IsDeleted)
                .ToListAsync(cancellationToken);

            foreach (var document in childDocuments)
            {
                document.IsDeleted = false;
                document.DeletedAt = null;
                _unitOfWork.DocumentRepository.Update(document);
            }

            var dto = documentGroup.Adapt<DocumentGroupDto>();
            return ApiResult<DocumentGroupDto>.Success(dto);
        }
    }
}
