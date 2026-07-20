using Application.Common;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Reports.Commands.CreateReport
{
    public class CreateReportHandler : IRequestHandler<CreateReportCommand, ApiResult<bool>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUser _currentUser;

        public CreateReportHandler(IUnitOfWork unitOfWork, ICurrentUser currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<bool>> Handle(CreateReportCommand request, CancellationToken cancellationToken)
        {
            if (!_currentUser.IsAuthenticated || _currentUser.Id is null)
                return ApiResult<bool>.Failure("Người dùng chưa đăng nhập");

            var documentExists = await _unitOfWork.DocumentRepository
                .GetByCondition(d => d.Id == request.DocumentId)
                .AnyAsync(cancellationToken);

            if (!documentExists)
                return ApiResult<bool>.Failure("Tài liệu không tồn tại");

            var report = request.Adapt<Domain.Entities.Report>();
            report.UserId = _currentUser.Id.Value;

            await _unitOfWork.ReportRepository.AddAsync(report);
            await _unitOfWork.SaveChangesAsync();

            return ApiResult<bool>.Success(true);
        }
    }
}
