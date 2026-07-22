using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.DocumentGroups.Commands.CreateGroup;
using Application.CQRS.DocumentGroups.Commands.DeleteGroup;
using Application.CQRS.DocumentGroups.Commands.RestoreGroup;
using Application.CQRS.DocumentGroups.Commands.UpdateGroup;
using Application.CQRS.DocumentGroups.DTOs;
using Application.CQRS.DocumentGroups.Queries.GetByUserId;
using Application.CQRS.DocumentGroups.Queries.GetPublishedGroup;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Client
{
    [Authorize]
    public class DocumentGroupController : ApiController
    {
        private readonly IMediator _mediator;
        public DocumentGroupController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentGroupDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentGroupDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetPublished([FromQuery] GetPublishedGroupQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("my/document-groups")]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentGroupDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentGroupDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetMine([FromQuery] GetGroupByUserIdQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateGroupCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return StatusCode(StatusCodes.Status201Created, result);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateGroupCommand command)
        {
            if (id != command.Id)
                return BadRequest(ApiResult<DocumentGroupDto>.Failure("Mã nhóm chủ đề không khớp"));

            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteGroupCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("restore/{id}")]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Restore(int id)
        {
            var result = await _mediator.Send(new RestoreGroupCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }
    }
}
