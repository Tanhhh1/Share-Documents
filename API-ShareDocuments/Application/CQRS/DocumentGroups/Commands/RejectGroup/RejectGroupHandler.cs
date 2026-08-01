using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using Domain.Events;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.DocumentGroups.Commands.RejectGroup
{
    internal class RejectGroupHandler : IRequestHandler<RejectGroupCommand, ApiResult<DocumentGroupDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        public RejectGroupHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
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
            documentGroup.AddDomainEvent(new DocumentGroupModeratedEvent(
                documentGroup.Id, documentGroup.UserId, _currentUser.Id!.Value, ModerationAction.Reject, request.Reason));

            var pendingDocuments = await _unitOfWork.DocumentRepository
                .GetByCondition(d => d.GroupId == documentGroup.Id && d.Status == DocumentStatus.Pending && !d.IsDeleted)
                .ToListAsync(cancellationToken);

            foreach (var document in pendingDocuments)
            {
                document.Status = DocumentStatus.Rejected;
                _unitOfWork.DocumentRepository.Update(document);
                document.AddDomainEvent(new DocumentModeratedEvent(
                    document.Id, document.UserId, _currentUser.Id!.Value, ModerationAction.Reject, request.Reason));
            }

            var documentGroupDto = documentGroup.Adapt<DocumentGroupDto>();
            return ApiResult<DocumentGroupDto>.Success(documentGroupDto);
        }
    }
}
