using Domain.Common;
using Domain.Enums;
using Domain.Identity;

namespace Domain.Entities
{
    public class Payment : BaseEntity
    {
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public MembershipPlan Plan { get; set; }
        public PaymentStatus Status { get; set; }
        public long OrderCode { get; set; }
        public string? TransactionId { get; set; }
        public DateTime? PaidAt { get; set; }
        public User User { get; set; } = null!;
    }
}
