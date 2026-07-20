using Domain.Common;
using Domain.Enums;
using Domain.Identity;

namespace Domain.Entities
{
    public class Membership : BaseEntity
    {
        public int UserId { get; set; }
        public MembershipPlan PlanCode { get; set; }
        public decimal Price { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public MembershipStatus Status { get; set; }
        public User User { get; set; } = null!;
    }
}
