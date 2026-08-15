using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using MediatR;


namespace Application.CQRS.Documents.Commands.DownloadDocument
{
    public class DownloadDocumentFileHandler : IRequestHandler<DownloadDocumentFileCommand, ApiResult<DocumentFileUrlDto>>
    {
        private const int SignedUrlExpiresInSeconds = 300;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        private readonly ISupabaseStorageService _storageService;
        private readonly IMemberService _memberService;
        private readonly IStatisticsService _statisticsService;
        public DownloadDocumentFileHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser, 
            ISupabaseStorageService storageService, IMemberService memberService, IStatisticsService statisticsService)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
            _storageService = storageService;
            _memberService = memberService;
            _statisticsService = statisticsService;
        }
        public async Task<ApiResult<DocumentFileUrlDto>> Handle(DownloadDocumentFileCommand request, CancellationToken cancellationToken)
        {
            var document = await _unitOfWork.DocumentRepository.GetByIdAsync(request.DocumentId);

            if (document is null || document.IsDeleted)
                return ApiResult<DocumentFileUrlDto>.Failure("Không tìm thấy tài liệu");

            var isOwner = document.UserId == _currentUser.Id;
            var isModerationBypass = _currentUser.IsAdmin || _currentUser.IsModerator;

            if (document.Status != DocumentStatus.Published && !isOwner && !isModerationBypass)
                return ApiResult<DocumentFileUrlDto>.Failure("Không tìm thấy tài liệu");

            if (document.AccessLevel == AccessLevel.Premium && !isOwner && !isModerationBypass)
            {
                var isActiveMember = await _memberService.IsActiveMemberAsync(_currentUser.Id!.Value, cancellationToken);
                if (!isActiveMember)
                    return ApiResult<DocumentFileUrlDto>.Failure("Tài liệu này chỉ dành cho thành viên Premium. Vui lòng nâng cấp tài khoản để tải xuống");
            }

            var signedUrl = await _storageService.GenerateSignedDownloadUrlAsync(
                document.S3Key, SignedUrlExpiresInSeconds, cancellationToken);

            if (_currentUser.Id.HasValue && !_currentUser.IsAdmin && !_currentUser.IsModerator)
                await _statisticsService.IncrementDownloadAsync(document.Id, _currentUser.Id!.Value, cancellationToken);

            var fileDto = new DocumentFileUrlDto
            {
                FileName = document.FileName,
                SignedUrl = signedUrl,
                ExpiresInSeconds = SignedUrlExpiresInSeconds,
                ConversionStatus = FileConversionStatus.Completed
            };

            return ApiResult<DocumentFileUrlDto>.Success(fileDto);
        }
    }
}
