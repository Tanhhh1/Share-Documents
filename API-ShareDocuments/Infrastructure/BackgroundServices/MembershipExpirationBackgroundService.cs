using Application.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.BackgroundServices
{
    public class MembershipExpirationBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<MembershipExpirationBackgroundService> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromHours(6);

        public MembershipExpirationBackgroundService(IServiceProvider serviceProvider, ILogger<MembershipExpirationBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken);
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var membershipExpirationService = scope.ServiceProvider.GetRequiredService<IMembershipExpirationService>();
                    await membershipExpirationService.ProcessExpiredMembershipsAsync(stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred in Membership Expiration Background Service");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}
