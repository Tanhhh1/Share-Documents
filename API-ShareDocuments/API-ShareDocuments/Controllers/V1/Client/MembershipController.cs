using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Members.DTOs;
using Application.CQRS.Members.Queries.GetCurrentMembership;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Client
{
    [Authorize]
    public class MembershipController : ApiController
    {
        private readonly IMediator _mediator;

        public MembershipController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<MembershipDto?>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCurrent()
        {
            var result = await _mediator.Send(new GetCurrentMembershipQuery());
            return Ok(result);
        }
    }
}
