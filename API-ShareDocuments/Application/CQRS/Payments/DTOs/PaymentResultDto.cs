namespace Application.CQRS.Payments.DTOs
{
    public class PaymentResultDto
    {
        public long OrderCode { get; set; }
        public string CheckoutUrl { get; set; } = string.Empty;
    }
}
