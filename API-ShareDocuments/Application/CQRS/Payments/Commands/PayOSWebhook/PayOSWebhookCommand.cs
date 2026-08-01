using Application.Common;
using MediatR;

namespace Application.CQRS.Payments.Commands.PayOSWebhook
{
    public class PayOSWebhookCommand : IRequest<ApiResult<bool>>
    {
        public string RawBody { get; set; } = string.Empty;
    }
}
