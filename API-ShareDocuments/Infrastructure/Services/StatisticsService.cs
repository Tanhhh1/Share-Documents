using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;

namespace Infrastructure.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IRedisService _redisService;
        private readonly IUnitOfWork _unitOfWork;

        // Trong khoảng thời gian này, 1 user chỉ tính 1 lượt xem/tải cho cùng 1 document,
        // tránh trường hợp F5 liên tục hoặc spam request để gian lận số liệu
        private static readonly TimeSpan ViewDedupWindow = TimeSpan.FromHours(12);
        private static readonly TimeSpan DownloadDedupWindow = TimeSpan.FromHours(12);

        private const string ViewKeyPrefix = "stats:view:";
        private const string DownloadKeyPrefix = "stats:download:";

        public StatisticsService(IRedisService redisService, IUnitOfWork unitOfWork)
        {
            _redisService = redisService;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> IncrementViewAsync(int documentId, int userId, CancellationToken cancellationToken = default)
        {
            var key = GetViewKey(documentId, userId);
            var isFirstTime = await _redisService.TrySetAsync(key, "1", ViewDedupWindow);
            if (!isFirstTime)
                return false;

            var document = await _unitOfWork.DocumentRepository.GetByIdAsync(documentId);
            if (document is null || document.IsDeleted)
                return false;

            document.IncreaseView();
            _unitOfWork.DocumentRepository.Update(document);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> IncrementDownloadAsync(int documentId, int userId, CancellationToken cancellationToken = default)
        {
            var key = GetDownloadKey(documentId, userId);
            var isFirstTime = await _redisService.TrySetAsync(key, "1", DownloadDedupWindow);
            if (!isFirstTime)
                return false;

            var document = await _unitOfWork.DocumentRepository.GetByIdAsync(documentId);
            if (document is null || document.IsDeleted)
                return false;

            document.IncreaseDownload();
            _unitOfWork.DocumentRepository.Update(document);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        private static string GetViewKey(int documentId, int userId) => $"{ViewKeyPrefix}{documentId}:{userId}";
        private static string GetDownloadKey(int documentId, int userId) => $"{DownloadKeyPrefix}{documentId}:{userId}";
    }
}

