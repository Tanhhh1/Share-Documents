using Application.Common;
using Application.CQRS.Documents.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using Domain.Identity;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Documents.Queries.GetByDocumentId
{
    public class GetByDocumentIdHandler : IRequestHandler<GetByDocumentIdQuery, ApiResult<DocumentDetailDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;
        private readonly IMemberService _memberService;
        private readonly IStatisticsService _statisticsService;

        public GetByDocumentIdHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser, IMemberService memberService, IStatisticsService statisticsService)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
            _memberService = memberService;
            _statisticsService = statisticsService;
        }
        public async Task<ApiResult<DocumentDetailDto>> Handle(GetByDocumentIdQuery request, CancellationToken cancellationToken)
        {
            var document = await _unitOfWork.DocumentRepository
                 .GetByCondition(d => d.Id == request.Id && !d.IsDeleted)
                 .ProjectToType<DocumentDetailDto>()
                 .FirstOrDefaultAsync(cancellationToken);

            if (document is null)
                return ApiResult<DocumentDetailDto>.Failure("Không tìm thấy tài liệu");

            var isOwner = document.UserId == _currentUser.Id;
            var isModerationBypass = _currentUser.IsAdmin || _currentUser.IsModerator;

            if (document.Status != DocumentStatus.Published && !isOwner && !isModerationBypass)
                return ApiResult<DocumentDetailDto>.Failure("Không tìm thấy tài liệu");

            if (_currentUser.Id.HasValue)
                await _statisticsService.IncrementViewAsync(document.Id, _currentUser.Id.Value, cancellationToken);

            if (document.AccessLevel == AccessLevel.Premium && !isOwner && !isModerationBypass)
            {
                var isActiveMember = await _memberService.IsActiveMemberAsync(_currentUser.Id!.Value, cancellationToken);

                if (!isActiveMember)
                    return ApiResult<DocumentDetailDto>.Failure("Tài liệu này chỉ dành cho thành viên Premium. Vui lòng nâng cấp tài khoản để xem chi tiết");
            }

            return ApiResult<DocumentDetailDto>.Success(document);
        }
    }
}
