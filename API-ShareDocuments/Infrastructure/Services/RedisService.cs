using Application.Interfaces.Services;
using StackExchange.Redis;

namespace Infrastructure.Services
{
    public class RedisService : IRedisService
    {
        private readonly IDatabase _database;

        public RedisService(IConnectionMultiplexer connectionMultiplexer)
        {
            _database = connectionMultiplexer.GetDatabase();
        }

        public async Task<bool> SetAsync(string key, string value, TimeSpan? expiry = null)
            => await _database.StringSetAsync(key, value, expiry);

        public async Task<string?> GetAsync(string key)
        {
            var value = await _database.StringGetAsync(key);
            return value.HasValue ? value.ToString() : null;
        }

        public async Task<bool> ExistsAsync(string key)
            => await _database.KeyExistsAsync(key);

        public async Task<bool> RemoveAsync(string key)
            => await _database.KeyDeleteAsync(key);

        public async Task<long> IncrementAsync(string key, long value = 1, TimeSpan? expiry = null)
        {
            var result = await _database.StringIncrementAsync(key, value);

            if (expiry.HasValue && result == value)
                await _database.KeyExpireAsync(key, expiry);

            return result;
        }

        public async Task<bool> TrySetAsync(string key, string value, TimeSpan expiry)
            => await _database.StringSetAsync(key, value, expiry, When.NotExists);
    }
}
