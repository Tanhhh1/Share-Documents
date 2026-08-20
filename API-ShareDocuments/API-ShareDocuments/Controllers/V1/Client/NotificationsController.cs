using API_ShareDocuments.Controllers.Common;
using Application.CQRS.Notifications.Commands.MarkAsRead;
using Application.CQRS.Notifications.Queries.GetNotifications;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1.Client
{
    public class NotificationsController : ApiController
    {
        private readonly IMediator _mediator;

        public NotificationsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] GetNotificationsQuery query, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpPatch("{id:int}/read")]
        public async Task<IActionResult> MarkAsRead(int id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new MarkNotificationAsReadCommand { Id = id }, cancellationToken);
            return Ok(result);
        }
    }
}