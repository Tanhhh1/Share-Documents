using Application.Interfaces.Repositories;

namespace Application.Interfaces.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
        IRefreshTokenRepository RefreshTokenRepository { get; }
        ITagRepository TagRepository { get; }
        IFacultyRepository FacultyRepository { get; }
        IMajorRepository MajorRepository { get; }
        ISubjectRepository SubjectRepository { get; }
        IEducationRepository EducationRepository { get; }
        IBookmarkRepository BookmarkRepository { get; }
        ICommentRepository CommentRepository { get; }
        IDocumentRepository DocumentRepository { get; }
        IReportRepository ReportRepository { get; }
    }
}
