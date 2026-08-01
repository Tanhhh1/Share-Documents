using Application.Interfaces.Services;
using Infrastructure.Configurations;
using Microsoft.Extensions.Options;
using PayOS;
using PayOS.Models.V2.PaymentRequests;
using PayOS.Models.Webhooks;
using System.Text.Json;

namespace Infrastructure.Services
{
    public class PayOSService : IPayOSService
    {
        private readonly PayOSClient _client;
        private readonly PayOSSettings _settings;

        public PayOSService(PayOSClient client, IOptions<PayOSSettings> options)
        {
            _client = client;
            _settings = options.Value;
        }

        public async Task<PayOSCreatePaymentResult> CreatePaymentLinkAsync(PayOSCreatePaymentRequest request, CancellationToken cancellationToken = default)
        {
            var payOSRequest = new CreatePaymentLinkRequest
            {
                OrderCode = request.OrderCode,
                Amount = request.Amount,
                Description = request.Description,
                BuyerName = request.BuyerName,
                BuyerEmail = request.BuyerEmail,
                ReturnUrl = _settings.ReturnUrl,
                CancelUrl = _settings.CancelUrl
            };

            var response = await _client.PaymentRequests.CreateAsync(payOSRequest);

            return new PayOSCreatePaymentResult
            {
                OrderCode = response.OrderCode,
                PaymentLinkId = response.PaymentLinkId,
                CheckoutUrl = response.CheckoutUrl,
                QrCode = response.QrCode
            };
        }

        public async Task CancelPaymentLinkAsync(long orderCode, CancellationToken cancellationToken = default)
        {
            await _client.PaymentRequests.CancelAsync(orderCode);
        }

        public async Task<PayOSWebhookResult> VerifyWebhookAsync(string rawWebhookBody)
        {
            var webhook = JsonSerializer.Deserialize<Webhook>(rawWebhookBody) ?? throw new InvalidOperationException("Payload webhook rỗng hoặc không hợp lệ");
            var data = await _client.Webhooks.VerifyAsync(webhook);

            return new PayOSWebhookResult
            {
                Success = webhook.Success,
                OrderCode = data.OrderCode,
                Amount = data.Amount,
                Reference = data.Reference,
                TransactionDateTime = data.TransactionDateTime,
                PaymentLinkId = data.PaymentLinkId
            };
        }
    }
}
