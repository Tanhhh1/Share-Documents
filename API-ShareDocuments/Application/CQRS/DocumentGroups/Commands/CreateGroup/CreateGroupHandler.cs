using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Entities;
using Domain.Enums;
using Mapster;
using MediatR;

namespace Application.CQRS.DocumentGroups.Commands.CreateGroup
{
    internal class CreateGroupHandler : IRequestHandler<CreateGroupCommand, ApiResult<DocumentGroupDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        public CreateGroupHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<DocumentGroupDto>> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<DocumentGroupDto>.Failure("Người dùng chưa đăng nhập");

            var documentGroup = request.Adapt<DocumentGroup>();
            documentGroup.UserId = _currentUser.Id.Value;
            documentGroup.Status = DocumentStatus.Pending;

            await _unitOfWork.DocumentGroupRepository.AddAsync(documentGroup);
            await _unitOfWork.SaveChangesAsync();

            var dto = documentGroup.Adapt<DocumentGroupDto>();
            return ApiResult<DocumentGroupDto>.Success(dto);
        }
    }
}
