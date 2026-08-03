using Application.Interfaces.Services;
using System.Security.Cryptography;

namespace Infrastructure.Services
{
    public class OtpService : IOtpService
    {
        private readonly IRedisService _redisService;
        private static readonly TimeSpan OtpExpiration = TimeSpan.FromMinutes(5);
        private const string CacheKeyPrefix = "otp:";

        public OtpService(IRedisService redisService)
        {
            _redisService = redisService;
        }

        public async Task<string> GenerateOtpAsync(string email, CancellationToken cancellationToken = default)
        {
            var otp = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
            var cacheKey = GetCacheKey(email);
            await _redisService.SetAsync(cacheKey, otp, OtpExpiration);
            return otp;
        }

        public async Task<bool> VerifyOtpAsync(string email, string otp, CancellationToken cancellationToken = default)
        {
            var cacheKey = GetCacheKey(email);
            var cachedOtp = await _redisService.GetAsync(cacheKey);
            if (cachedOtp != null && cachedOtp == otp)
            {
                await _redisService.RemoveAsync(cacheKey);
                return true;
            }
            return false;
        }

        public async Task RemoveOtpAsync(string email, CancellationToken cancellationToken = default)
        {
            await _redisService.RemoveAsync(GetCacheKey(email));
        }

        private static string GetCacheKey(string email) => $"{CacheKeyPrefix}{email.Trim().ToLowerInvariant()}";
    }
}
