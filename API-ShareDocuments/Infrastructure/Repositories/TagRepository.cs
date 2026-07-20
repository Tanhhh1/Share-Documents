using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistences;
using Infrastructure.Repositories.Common;

namespace Infrastructure.Repositories
{
    public class TagRepository(DatabaseContext dbContext) : BaseRepository<Tag>(dbContext), ITagRepository
    {
    }
}
