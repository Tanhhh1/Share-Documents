using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistences;
using Infrastructure.Repositories.Common;

namespace Infrastructure.Repositories
{
    public class BookmarkRepository(DatabaseContext dbContext) : BaseRepository<Bookmark>(dbContext), IBookmarkRepository
    {
    }
}
