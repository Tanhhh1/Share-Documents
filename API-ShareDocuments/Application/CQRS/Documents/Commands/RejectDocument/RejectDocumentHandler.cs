using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using Domain.Events;
using Mapster;
using MediatR;

namespace Application.CQRS.Documents.Commands.RejectDocument
{
    public class RejectDocumentHandler : IRequestHandler<RejectDocumentCommand, ApiResult<DocumentDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public RejectDocumentHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<DocumentDto>> Handle(RejectDocumentCommand request, CancellationToken cancellationToken)
        {
            var document = await _unitOfWork.DocumentRepository.GetByIdAsync(request.Id);

            if (document is null || document.IsDeleted)
                return ApiResult<DocumentDto>.Failure("Không tìm thấy tài liệu");

            if (document.Status != DocumentStatus.Pending)
                return ApiResult<DocumentDto>.Failure("Chỉ có thể từ chối tài liệu đang ở trạng thái chờ duyệt");

            document.Status = DocumentStatus.Rejected;
            _unitOfWork.DocumentRepository.Update(document);

            document.AddDomainEvent(new DocumentModeratedEvent(
                document.Id, document.UserId, _currentUser.Id!.Value, ModerationAction.Reject, request.Reason));

            var dto = document.Adapt<DocumentDto>();
            return ApiResult<DocumentDto>.Success(dto);
        }
    }
}
