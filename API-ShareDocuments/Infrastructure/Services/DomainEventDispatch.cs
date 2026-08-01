using Application.Interfaces.Services;
using Domain.Common;
using MediatR;

namespace Infrastructure.Services
{
    public class DomainEventDispatch : IDomainEventDispatch
    {
        private readonly IPublisher _publisher;

        public DomainEventDispatch(IPublisher publisher)
        {
            _publisher = publisher;
        }

        public async Task DispatchEventsAsync(IEnumerable<BaseDomainEntity> entitiesWithEvents, CancellationToken cancellationToken = default)
        {
            foreach (var entity in entitiesWithEvents)
            {
                var events = entity.DomainEvents.ToList();
                entity.ClearDomainEvents();

                foreach (var domainEvent in events)
                    await _publisher.Publish(domainEvent, cancellationToken);
            }
        }
    }
}
