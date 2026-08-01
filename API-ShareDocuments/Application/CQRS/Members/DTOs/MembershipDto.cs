using Domain.Enums;

namespace Application.CQRS.Members.DTOs
{
    public class MembershipDto
    {
        public int Id { get; set; }
        public MembershipPlan PlanCode { get; set; }
        public decimal Price { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public MembershipStatus Status { get; set; }
        public bool IsActive { get; set; }
        public int DaysRemaining { get; set; }
    }
}
