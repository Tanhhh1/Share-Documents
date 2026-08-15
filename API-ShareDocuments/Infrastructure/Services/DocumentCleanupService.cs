using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class DocumentCleanupService : IDocumentCleanupService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISupabaseStorageService _storageService;
        private readonly ILogger<DocumentCleanupService> _logger;
        private const int DaysBeforeHardDelete = 30;

        public DocumentCleanupService(IUnitOfWork unitOfWork, ISupabaseStorageService storageService, ILogger<DocumentCleanupService> logger)
        {
            _unitOfWork = unitOfWork;
            _storageService = storageService;
            _logger = logger;
        }

        public async Task<int> CleanupDeletedDocumentsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var cutoffDate = DateTime.UtcNow.AddDays(-DaysBeforeHardDelete);

                var documentsToDelete = await _unitOfWork.DocumentRepository
                    .GetByCondition(d => d.IsDeleted && d.DeletedAt <= cutoffDate)
                    .ToListAsync(cancellationToken);

                var groupsToDelete = await _unitOfWork.DocumentGroupRepository
                    .GetByCondition(dg => dg.IsDeleted && dg.DeletedAt <= cutoffDate)
                    .ToListAsync(cancellationToken);

                if (!documentsToDelete.Any() && !groupsToDelete.Any())
                    return 0;

                foreach (var document in documentsToDelete)
                {
                    try
                    {
                        if (!string.IsNullOrEmpty(document.S3Key))
                            await _storageService.DeleteAsync(document.S3Key, cancellationToken);

                        if (!string.IsNullOrEmpty(document.PreviewPdfKey))
                            await _storageService.DeleteAsync(document.PreviewPdfKey, cancellationToken);

                        if (!string.IsNullOrEmpty(document.ThumbnailKey))
                            await _storageService.DeleteAsync(document.ThumbnailKey, cancellationToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to delete storage files for DocumentId {DocumentId}", document.Id);
                    }

                    _unitOfWork.DocumentRepository.Delete(document);
                }

                foreach (var group in groupsToDelete)
                    _unitOfWork.DocumentGroupRepository.Delete(group);

                await _unitOfWork.SaveChangesAsync();

                var totalDeleted = documentsToDelete.Count + groupsToDelete.Count;
                _logger.LogInformation("Cleaned up {DocumentCount} documents and {GroupCount} document groups", documentsToDelete.Count, groupsToDelete.Count);

                return totalDeleted;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during document cleanup process");
                throw;
            }
        }
    }
}