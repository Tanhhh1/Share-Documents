using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Tags.Commands.CreateTag;
using Application.CQRS.Tags.Commands.DeleteTag;
using Application.CQRS.Tags.Commands.RestoreTag;
using Application.CQRS.Tags.Commands.UpdateTag;
using Application.CQRS.Tags.DTOs;
using Application.CQRS.Tags.Queries.GetAllTag;
using Application.CQRS.Tags.Queries.GetByTagId;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Client
{
    public class TagController : AdminApiController
    {
        private readonly IMediator _mediator;
        public TagController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<PageList<TagDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<TagDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllTagQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResult<TagDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<TagDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetByTagIdQuery { Id = id });
            if (!result.Succeeded)
                return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResult<TagDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResult<TagDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateTagCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return CreatedAtAction(nameof(GetById), new { id = result.Result!.Id }, result);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResult<TagDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<TagDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTagCommand command)
        {
            if (id != command.Id)
                return BadRequest(ApiResult<TagDto>.Failure("Mã Môn học không khớp"));

            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("delete/{id}")]
        [ProducesResponseType(typeof(ApiResult<TagDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<TagDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteTagCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("restore/{id}")]
        [ProducesResponseType(typeof(ApiResult<TagDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<TagDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Restore(int id)
        {
            var result = await _mediator.Send(new RestoreTagCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }
    }
}
