using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.DocumentGroups.Commands.DeleteGroup
{
    public class DeleteGroupHandler : IRequestHandler<DeleteGroupCommand, ApiResult<DocumentGroupDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public DeleteGroupHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<DocumentGroupDto>> Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<DocumentGroupDto>.Failure("Người dùng chưa đăng nhập");

            var documentGroup = await _unitOfWork.DocumentGroupRepository.GetByIdAsync(request.Id);
            if (documentGroup is null)
                return ApiResult<DocumentGroupDto>.Failure("Không tìm thấy nhóm chủ đề");
            if (documentGroup.UserId != _currentUser.Id.Value)
                return ApiResult<DocumentGroupDto>.Failure("Bạn không có quyền xóa nhóm chủ đề này");
            if (documentGroup.IsDeleted)
                return ApiResult<DocumentGroupDto>.Failure("Nhóm chủ đề đã bị xóa trước đó");

            var now = DateTime.UtcNow;

            documentGroup.IsDeleted = true;
            documentGroup.DeletedAt = now;
            _unitOfWork.DocumentGroupRepository.Update(documentGroup);

            var childDocuments = await _unitOfWork.DocumentRepository
                .GetByCondition(d => d.GroupId == documentGroup.Id && !d.IsDeleted)
                .ToListAsync(cancellationToken);

            foreach (var document in childDocuments)
            {
                document.IsDeleted = true;
                document.DeletedAt = now;
                _unitOfWork.DocumentRepository.Update(document);
            }

            var dto = documentGroup.Adapt<DocumentGroupDto>();
            return ApiResult<DocumentGroupDto>.Success(dto);
        }
    }
}
