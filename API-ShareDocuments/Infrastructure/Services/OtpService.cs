using Application.Interfaces.Services;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Cryptography;

namespace Infrastructure.Services
{
    public class OtpService : IOtpService
    {
        private readonly IMemoryCache _cache;
        private static readonly TimeSpan OtpExpiration = TimeSpan.FromMinutes(5);
        private const string CacheKeyPrefix = "otp:";

        public OtpService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public Task<string> GenerateOtpAsync(string email, CancellationToken cancellationToken = default)
        {
            var otp = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
            var cacheKey = GetCacheKey(email);

            _cache.Set(cacheKey, otp, OtpExpiration);

            return Task.FromResult(otp);
        }

        public Task<bool> VerifyOtpAsync(string email, string otp, CancellationToken cancellationToken = default)
        {
            var cacheKey = GetCacheKey(email);

            if (_cache.TryGetValue(cacheKey, out string? cachedOtp) && cachedOtp == otp)
            {
                _cache.Remove(cacheKey);
                return Task.FromResult(true);
            }

            return Task.FromResult(false);
        }

        public Task RemoveOtpAsync(string email, CancellationToken cancellationToken = default)
        {
            _cache.Remove(GetCacheKey(email));
            return Task.CompletedTask;
        }

        private static string GetCacheKey(string email) => $"{CacheKeyPrefix}{email.Trim().ToLowerInvariant()}";
    }
}
