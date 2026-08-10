using Application.CQRS.Notifications.DTOs;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Domain.Common;
using Domain.Entities;
using Infrastructure.Persistences;
using Infrastructure.Repositories;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Uow
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DatabaseContext _dbContext;
        private IDbContextTransaction? _transaction;
        private readonly IDomainEventDispatch _domainEventDispatch;
        private readonly INotificationService _notificationService;
        private readonly ILogger<UnitOfWork> _logger;
        private IRefreshTokenRepository? _refreshTokenRepository;
        private ITagRepository? _tagRepository;
        private IFacultyRepository? _facultyRepository;
        private IMajorRepository? _majorRepository;
        private ISubjectRepository? _subjectRepository;
        private IBookmarkRepository? _bookmarkRepository;
        private ICommentRepository? _commentRepository;
        private IDocumentRepository? _documentRepository;
        private IReportRepository? _reportRepository;
        private IDocumentGroupRepository? _documentGroupRepository;
        private IDocumentFileRepository? _documentFileRepository;
        private IPaymentRepository? _paymentRepository;
        private IMembershipRepository? _membershipRepository;
        private INotificationRepository? _notificationRepository;
        private IModerationLogRepository? _moderationLogRepository;
        public UnitOfWork(DatabaseContext dbContext, IDomainEventDispatch domainEventDispatch, INotificationService notificationService, ILogger<UnitOfWork> logger)
        {
            _dbContext = dbContext;
            _domainEventDispatch = domainEventDispatch;
            _notificationService = notificationService;
            _logger = logger;
        }

        public IRefreshTokenRepository RefreshTokenRepository => _refreshTokenRepository ??= new RefreshTokenRepository(_dbContext);
        public ITagRepository TagRepository => _tagRepository ??= new TagRepository(_dbContext);
        public IFacultyRepository FacultyRepository => _facultyRepository ??= new FacultyRepository(_dbContext);
        public IMajorRepository MajorRepository => _majorRepository ??= new MajorRepository(_dbContext);
        public ISubjectRepository SubjectRepository => _subjectRepository ??= new SubjectRepository(_dbContext);
        public IBookmarkRepository BookmarkRepository => _bookmarkRepository ??= new BookmarkRepository(_dbContext);
        public ICommentRepository CommentRepository => _commentRepository ??= new CommentRepository(_dbContext);
        public IDocumentRepository DocumentRepository => _documentRepository ??= new DocumentRepository(_dbContext);
        public IReportRepository ReportRepository => _reportRepository ??= new ReportRepository(_dbContext);
        public IDocumentGroupRepository DocumentGroupRepository => _documentGroupRepository ??= new DocumentGroupRepository(_dbContext);
        public IDocumentFileRepository DocumentFileRepository => _documentFileRepository ??= new DocumentFileRepository(_dbContext);
        public IPaymentRepository PaymentRepository => _paymentRepository ??= new PaymentRepository(_dbContext);
        public IMembershipRepository MembershipRepository => _membershipRepository ??= new MembershipRepository(_dbContext);
        public IModerationLogRepository ModerationLogRepository => _moderationLogRepository ??= new ModerationLogRepository(_dbContext);
        public INotificationRepository NotificationRepository => _notificationRepository ??= new NotificationRepository(_dbContext);

        public async Task BeginTransactionAsync()
        {
            if (_dbContext.Database.CurrentTransaction is null)
            {
                _transaction = await _dbContext.Database.BeginTransactionAsync();
            }
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await _dbContext.SaveChangesAsync();

                var entities = _dbContext.ChangeTracker
                    .Entries<BaseDomainEntity>()
                    .Where(e => e.Entity.DomainEvents.Any())
                    .Select(e => e.Entity)
                    .ToList();

                await _domainEventDispatch.DispatchEventsAsync(entities);

                var newNotifications = _dbContext.ChangeTracker
                    .Entries<Notification>()
                    .Where(e => e.State == EntityState.Added)
                    .Select(e => e.Entity)
                    .ToList();

                await _dbContext.SaveChangesAsync();

                if (_transaction is not null)
                    await _transaction.CommitAsync();

                await TryNotifyRealtimeAsync(newNotifications);
            }
            catch
            {
                await RollbackTransactionAsync();
                throw;
            }
            finally
            {
                await DisposeTransactionAsync();
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction is not null)
            {
                await _transaction.RollbackAsync();
                await DisposeTransactionAsync();
            }
        }

        private async Task DisposeTransactionAsync()
        {
            if (_transaction is not null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _dbContext.Dispose();
        }

        private async Task TryNotifyRealtimeAsync(List<Notification> notifications)
        {
            foreach (var notification in notifications)
            {
                try
                {
                    var dto = notification.Adapt<NotificationDto>();
                    await _notificationService.NotifyUserAsync(notification.UserId, dto);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Gửi thông báo real-time thất bại cho UserId={UserId}, NotificationId={NotificationId}. Dữ liệu đã được lưu vào DB, chỉ push SignalR bị lỗi.",
                        notification.UserId, notification.Id);
                }
            }
        }
    }
}
