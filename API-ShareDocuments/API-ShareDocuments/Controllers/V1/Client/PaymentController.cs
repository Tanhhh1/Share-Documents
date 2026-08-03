using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Payments.Commands.CreatePayment;
using Application.CQRS.Payments.Commands.PayOSWebhook;
using Application.CQRS.Payments.DTOs;
using Application.CQRS.Payments.Queries.GetPaymentHistory;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Client
{
    [Authorize(Roles = "User")]
    public class PaymentController : ApiController
    {
        private readonly IMediator _mediator;
        public PaymentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResult<PaymentResultDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResult<PaymentResultDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreatePaymentCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return StatusCode(StatusCodes.Status201Created, result);
        }

        [HttpGet("history")]
        [ProducesResponseType(typeof(ApiResult<PageList<PaymentDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<PaymentDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetHistory([FromQuery] GetPaymentHistoryQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("payos-webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> PayOSWebhook()
        {
            using var reader = new StreamReader(Request.Body);
            var rawBody = await reader.ReadToEndAsync();

            await _mediator.Send(new PayOSWebhookCommand { RawBody = rawBody });

            return Ok();
        }
    }
}
