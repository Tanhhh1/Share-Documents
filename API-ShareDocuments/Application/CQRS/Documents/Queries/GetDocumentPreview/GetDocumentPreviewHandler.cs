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

            if (document is null || document.IsDeleted)
                return ApiResult<DocumentFileUrlDto>.Failure("Không tìm thấy tài liệu");

            var isOwner = document.UserId == _currentUser.Id!.Value;
            if (document.Status != DocumentStatus.Published && !isOwner)
                return ApiResult<DocumentFileUrlDto>.Failure("Không tìm thấy tài liệu");

            var file = await _unitOfWork.DocumentFileRepository.GetByIdAsync(request.FileId);
            if (file is null || file.DocumentId != document.Id)
                return ApiResult<DocumentFileUrlDto>.Failure("Không tìm thấy file trong tài liệu này");

            if (file.FileType != "pdf")
                return ApiResult<DocumentFileUrlDto>.Failure("Định dạng file này chưa hỗ trợ xem trước");

            var signedUrl = await _storageService.GenerateSignedDownloadUrlAsync(
                file.S3Key, SignedUrlExpiresInSeconds, cancellationToken);

            var fileDto = new DocumentFileUrlDto
            {
                FileName = file.FileName,
                SignedUrl = signedUrl,
                ExpiresInSeconds = SignedUrlExpiresInSeconds
            };

            return ApiResult<DocumentFileUrlDto>.Success(fileDto);
        }
    }
}
