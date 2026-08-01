using Domain.Common;

namespace Application.Interfaces.Services
{
    public interface IDomainEventDispatch
    {
        Task DispatchEventsAsync(IEnumerable<BaseDomainEntity> entitiesWithEvents, CancellationToken cancellationToken = default);
    }
}
