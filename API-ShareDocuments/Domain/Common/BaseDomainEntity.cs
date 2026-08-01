using MediatR;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Common
{
    public abstract class BaseDomainEvent : INotification
    {
        public DateTime OccurredOn { get; } = DateTime.UtcNow;
    }

    public abstract class BaseDomainEntity : BaseEntity
    {
        private readonly List<BaseDomainEvent> _domainEvents = new();
        [NotMapped]
        public IReadOnlyCollection<BaseDomainEvent> DomainEvents => _domainEvents.AsReadOnly();
        public void AddDomainEvent(BaseDomainEvent domainEvent) => _domainEvents.Add(domainEvent);
        public void ClearDomainEvents() => _domainEvents.Clear();
    }
}
