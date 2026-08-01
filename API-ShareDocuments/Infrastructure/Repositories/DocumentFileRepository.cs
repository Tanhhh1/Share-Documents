using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistences;
using Infrastructure.Repositories.Common;

namespace Infrastructure.Repositories
{
    public class DocumentFileRepository(DatabaseContext dbContext) : BaseRepository<DocumentFile>(dbContext), IDocumentFileRepository
    {
    }
}
