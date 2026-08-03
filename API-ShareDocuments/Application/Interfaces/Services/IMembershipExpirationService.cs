namespace Application.Interfaces.Services
{
    public interface IMembershipExpirationService
    {
        Task<int> ProcessExpiredMembershipsAsync(CancellationToken cancellationToken = default);
    }
}
