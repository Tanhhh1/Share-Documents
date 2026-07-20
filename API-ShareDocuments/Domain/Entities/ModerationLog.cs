using Domain.Common;
using Domain.Enums;
using Domain.Identity;

namespace Domain.Entities
{
    public class ModerationLog : BaseEntity
    {
        public int UserId { get; set; }
        public EntityType Type { get; set; }
        public int TargetId { get; set; }
        public ModerationAction Action { get; set; }
        public string? Reason { get; set; }
        public User User { get; set; } = null!;
    }
}
