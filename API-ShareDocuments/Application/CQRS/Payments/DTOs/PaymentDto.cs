using Domain.Enums;

namespace Application.CQRS.Payments.DTOs
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public long OrderCode { get; set; }
        public decimal Amount { get; set; }
        public MembershipPlan Plan { get; set; }
        public PaymentStatus Status { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
