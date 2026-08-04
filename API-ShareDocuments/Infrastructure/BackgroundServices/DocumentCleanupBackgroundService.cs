using Application.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.BackgroundServices
{
    public class DocumentCleanupBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DocumentCleanupBackgroundService> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromHours(1);

        public DocumentCleanupBackgroundService(IServiceProvider serviceProvider, ILogger<DocumentCleanupBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var documentCleanupService = scope.ServiceProvider.GetRequiredService<IDocumentCleanupService>();
                    int cleanedCount = await documentCleanupService.CleanupDeletedDocumentsAsync(stoppingToken);
                    _logger.LogInformation("Document Cleanup: Processed and cleaned up {count} documents.", cleanedCount);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred in Document Cleanup Background Service.");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}