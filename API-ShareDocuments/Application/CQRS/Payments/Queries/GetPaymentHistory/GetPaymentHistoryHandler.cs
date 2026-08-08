using Application.Common;
using Application.CQRS.Payments.DTOs;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;

namespace Application.CQRS.Payments.Queries.GetPaymentHistory
{
    public class GetPaymentHistoryHandler : IRequestHandler<GetPaymentHistoryQuery, ApiResult<PageList<PaymentDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public GetPaymentHistoryHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<PageList<PaymentDto>>> Handle(GetPaymentHistoryQuery request, CancellationToken cancellationToken)
        {
            var query = _unitOfWork.PaymentRepository
                .GetByCondition(p => p.UserId == _currentUser.Id!.Value, q => q.OrderByDescending(p => p.CreatedAt))
                .ProjectToType<PaymentDto>();

            var pagedResult = await PageList<PaymentDto>.ToPagedListAsync(
                query, request.PageIndex, request.PageSize, cancellationToken);

            return ApiResult<PageList<PaymentDto>>.Success(pagedResult);
        }
    }
}
