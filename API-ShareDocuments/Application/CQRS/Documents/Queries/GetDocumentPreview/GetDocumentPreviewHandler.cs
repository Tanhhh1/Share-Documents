using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using MediatR;

namespace Application.CQRS.Documents.Queries.GetDocumentPreview
{
    public class GetDocumentPreviewHandler : IRequestHandler<GetDocumentPreviewQuery, ApiResult<DocumentFileUrlDto>>
    {
        private const int SignedUrlExpiresInSeconds = 600;

        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        private readonly ISupabaseStorageService _storageService;

        public GetDocumentPreviewHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser, ISupabaseStorageService storageService)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
            _storageService = storageService;
        }

        public async Task<ApiResult<DocumentFileUrlDto>> Handle(GetDocumentPreviewQuery request, CancellationToken cancellationToken)
        {
            var document = await _unitOfWork.DocumentRepository.GetByIdAsync(request.DocumentId);

            var isOwner = _currentUser.Id.HasValue && document.UserId == _currentUser.Id.Value;
            var isModerationBypass = _currentUser.IsAdmin || _currentUser.IsModerator;

            if (document.Status != DocumentStatus.Published && !isOwner && !isModerationBypass)
                return ApiResult<DocumentFileUrlDto>.Failure("Không tìm thấy tài liệu");

            switch (document.ConversionStatus)
            {
                case FileConversionStatus.Pending:
                    return ApiResult<DocumentFileUrlDto>.Failure("Bản xem trước đang được xử lý, vui lòng thử lại sau ít phút");

                case FileConversionStatus.Failed:
                    return ApiResult<DocumentFileUrlDto>.Failure("Không thể tạo bản xem trước cho tài liệu này");
            }

            if (string.IsNullOrEmpty(document.PreviewPdfKey))
                return ApiResult<DocumentFileUrlDto>.Failure("Tài liệu này chưa hỗ trợ xem trước");

            var signedUrl = await _storageService.GenerateSignedDownloadUrlAsync(
                document.PreviewPdfKey, SignedUrlExpiresInSeconds, cancellationToken);

            var fileDto = new DocumentFileUrlDto
            {
                FileName = document.FileName,
                SignedUrl = signedUrl,
                ExpiresInSeconds = SignedUrlExpiresInSeconds,
                ConversionStatus = document.ConversionStatus
            };

            return ApiResult<DocumentFileUrlDto>.Success(fileDto);
        }
    }
}