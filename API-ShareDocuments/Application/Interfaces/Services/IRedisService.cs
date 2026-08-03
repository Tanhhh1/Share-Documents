namespace Application.Interfaces.Services
{
    public interface IRedisService
    {
        Task<bool> SetAsync(string key, string value, TimeSpan? expiry = null);
        Task<string?> GetAsync(string key);
        Task<bool> ExistsAsync(string key);
        Task<bool> RemoveAsync(string key);
        Task<long> IncrementAsync(string key, long value = 1, TimeSpan? expiry = null);
        Task<bool> TrySetAsync(string key, string value, TimeSpan expiry);
    }
}
