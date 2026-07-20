using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Profile.Commands.UpdateInformation;
using Application.CQRS.Profile.Commands.UpdatePassword;
using Application.CQRS.Profile.DTOs;
using Application.CQRS.Profile.Queries.GetByUserId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Client
{
    [Authorize]
    public class ProfileController : ApiController
    {
        private readonly IMediator _mediator;
        public ProfileController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProfile()
        {
            var result = await _mediator.Send(new GetByUserIdQuery());
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("update-information")]
        [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateInforCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("update-password")]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ChangePassword([FromBody] UpdatePasswordCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }
    }
}
