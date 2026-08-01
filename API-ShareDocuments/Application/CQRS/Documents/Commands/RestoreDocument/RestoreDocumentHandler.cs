using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Documents.Commands.RestoreDocument
{
    public class RestoreDocumentHandler : IRequestHandler<RestoreDocumentCommand, ApiResult<DocumentDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        public RestoreDocumentHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<DocumentDto>> Handle(RestoreDocumentCommand request, CancellationToken cancellationToken)
        {
            var document = await _unitOfWork.DocumentRepository.GetByIdAsync(request.Id);

            if (document is null)
                return ApiResult<DocumentDto>.Failure("Không tìm thấy tài liệu");
            if (document.UserId != _currentUser.Id!.Value)
                return ApiResult<DocumentDto>.Failure("Bạn không có quyền khôi phục tài liệu này");
            if (!document.IsDeleted)
                return ApiResult<DocumentDto>.Failure("Tài liệu hiện không ở trạng thái bị xóa");

            document.IsDeleted = false;
            document.DeletedAt = null;

            _unitOfWork.DocumentRepository.Update(document);
            var documentDto = document.Adapt<DocumentDto>();
            return ApiResult<DocumentDto>.Success(documentDto);
        }
    }
}
