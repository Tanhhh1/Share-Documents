using Domain.Common;
using Domain.Enums;
using Domain.Identity;

namespace Domain.Entities
{
    public class Payment : BaseEntity
    {
        public int UserId { get; set; }
        public int MembershipId { get; set; }
        public decimal Price { get; set; }
        public PaymentStatus Status { get; set; }
        public User User { get; set; } = null!;
        public Membership Membership { get; set; } = null!;
    }
}
