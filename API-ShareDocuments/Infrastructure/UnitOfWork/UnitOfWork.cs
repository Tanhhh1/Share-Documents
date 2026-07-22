using Application.Interfaces.Repositories;
using Application.Interfaces.UnitOfWork;
using Infrastructure.Persistences;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Uow
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DatabaseContext _dbContext;
        private IDbContextTransaction? _transaction;
        private IRefreshTokenRepository? _refreshTokenRepository;
        private ITagRepository? _tagRepository;
        private IFacultyRepository? _facultyRepository;
        private IMajorRepository? _majorRepository;
        private ISubjectRepository? _subjectRepository;
        private IEducationRepository? _educationRepository;
        private IBookmarkRepository? _bookmarkRepository;
        private ICommentRepository? _commentRepository;
        private IDocumentRepository? _documentRepository;
        private IReportRepository? _reportRepository;
        private IDocumentGroupRepository? _documentGroupRepository;
        private IDocumentFileRepository? _documentFileRepository;
        public UnitOfWork(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IRefreshTokenRepository RefreshTokenRepository => _refreshTokenRepository ??= new RefreshTokenRepository(_dbContext);
        public ITagRepository TagRepository => _tagRepository ??= new TagRepository(_dbContext);
        public IFacultyRepository FacultyRepository => _facultyRepository ??= new FacultyRepository(_dbContext);
        public IMajorRepository MajorRepository => _majorRepository ??= new MajorRepository(_dbContext);
        public ISubjectRepository SubjectRepository => _subjectRepository ??= new SubjectRepository(_dbContext);
        public IEducationRepository EducationRepository => _educationRepository ??= new EducationRepository(_dbContext);
        public IBookmarkRepository BookmarkRepository => _bookmarkRepository ??= new BookmarkRepository(_dbContext);
        public ICommentRepository CommentRepository => _commentRepository ??= new CommentRepository(_dbContext);
        public IDocumentRepository DocumentRepository => _documentRepository ??= new DocumentRepository(_dbContext);
        public IReportRepository ReportRepository => _reportRepository ??= new ReportRepository(_dbContext);
        public IDocumentGroupRepository DocumentGroupRepository => _documentGroupRepository ??= new DocumentGroupRepository(_dbContext);
        public IDocumentFileRepository DocumentFileRepository => _documentFileRepository ??= new DocumentFileRepository(_dbContext);

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
                if (_transaction is not null) await _transaction.CommitAsync();
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
    }
}
