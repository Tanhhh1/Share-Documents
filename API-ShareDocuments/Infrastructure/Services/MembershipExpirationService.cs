using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class MembershipExpirationService : IMembershipExpirationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<MembershipExpirationService> _logger;
        public MembershipExpirationService(IUnitOfWork unitOfWork, ILogger<MembershipExpirationService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<int> ProcessExpiredMembershipsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var now = DateTime.UtcNow;
                var expiredMemberships = await _unitOfWork.MembershipRepository
                    .GetByCondition(m => m.Status == MembershipStatus.Active && m.EndDate <= now)
                    .Include(m => m.User)
                    .ToListAsync(cancellationToken);

                if (!expiredMemberships.Any())
                    return 0;

                var updatedUsersCount = 0;
                foreach (var membership in expiredMemberships)
                {
                    membership.Status = MembershipStatus.Expired;
                    _unitOfWork.MembershipRepository.Update(membership);

                    if (membership.User != null)
                    {
                        membership.User.IsMember = false;
                        membership.User.MemberExpiresAt = null;
                        updatedUsersCount++;
                    }
                }

                await _unitOfWork.SaveChangesAsync();

                _logger.LogInformation("Processed {Count} expired memberships and reset {UserCount} users",expiredMemberships.Count, updatedUsersCount);
                return updatedUsersCount;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during membership expiration processing");
                throw;
            }
        }
    }
}