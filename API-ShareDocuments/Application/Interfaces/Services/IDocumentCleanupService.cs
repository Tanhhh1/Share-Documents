namespace Application.Interfaces.Services
{
    public interface IDocumentCleanupService
    {
        Task<int> CleanupDeletedDocumentsAsync(CancellationToken cancellationToken = default);
    }
}
