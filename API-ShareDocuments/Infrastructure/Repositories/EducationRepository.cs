using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistences;
using Infrastructure.Repositories.Common;

namespace Infrastructure.Repositories
{
    public class EducationRepository(DatabaseContext dbContext) : BaseRepository<EducationLevel>(dbContext), IEducationRepository
    {
    }
}
