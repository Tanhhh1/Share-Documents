namespace Application.Interfaces.Services
{
    public interface IStatisticsService
    {
        Task<bool> IncrementViewAsync(int documentId, int userId, CancellationToken cancellationToken = default);
        Task<bool> IncrementDownloadAsync(int documentId, int userId, CancellationToken cancellationToken = default);
    }
}
