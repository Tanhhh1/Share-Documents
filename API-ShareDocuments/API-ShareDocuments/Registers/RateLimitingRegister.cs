using System.Threading.RateLimiting;

namespace API_ShareDocuments.Registers
{
    public static class RateLimitingRegiste
    {
        public static IServiceCollection AddRateLimitingPolicies(this IServiceCollection services)
        {
            services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                options.OnRejected = async (context, token) =>
                {
                    context.HttpContext.Response.ContentType = "application/json";

                    await context.HttpContext.Response.WriteAsJsonAsync(new { message = "Too many requests. Please try again later" }, token);
                };

                // Fixed Window
                options.AddPolicy("FixedWindow", httpContext =>
                {
                    var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    return RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: ip,
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 10,
                            Window = TimeSpan.FromMinutes(1),
                            QueueLimit = 0,
                            AutoReplenishment = true
                        });
                });

                // Sliding Window
                options.AddPolicy("SlidingWindow", httpContext =>
                {
                    var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    return RateLimitPartition.GetSlidingWindowLimiter(
                        partitionKey: ip,
                        factory: _ => new SlidingWindowRateLimiterOptions
                        {
                            PermitLimit = 20,
                            Window = TimeSpan.FromMinutes(1),
                            SegmentsPerWindow = 6,
                            QueueLimit = 0,
                            AutoReplenishment = true
                        });
                });

                // Token Bucket
                options.AddPolicy("TokenBucket", httpContext =>
                {
                    var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    return RateLimitPartition.GetTokenBucketLimiter(
                        partitionKey: ip,
                        factory: _ => new TokenBucketRateLimiterOptions
                        {
                            TokenLimit = 30,
                            TokensPerPeriod = 10,
                            ReplenishmentPeriod = TimeSpan.FromSeconds(20),
                            QueueLimit = 0,
                            AutoReplenishment = true
                        });
                });

                // Concurrency
                options.AddPolicy("Concurrency", httpContext =>
                {
                    var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    return RateLimitPartition.GetConcurrencyLimiter(
                        partitionKey: ip,
                        factory: _ => new ConcurrencyLimiterOptions
                        {
                            PermitLimit = 2,
                            QueueLimit = 0
                        });
                });
            });
            return services;
        }
    }
}
