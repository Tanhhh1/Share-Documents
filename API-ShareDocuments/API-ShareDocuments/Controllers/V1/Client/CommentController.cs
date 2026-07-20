using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Comments.Commands.CreateComment;
using Application.CQRS.Comments.Commands.DeleteComment;
using Application.CQRS.Comments.DTOs;
using Application.CQRS.Comments.Queries.GetCmtByDocIdQuery;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Client
{
    public class CommentController : ApiController
    {
        private readonly IMediator _mediator;
        public CommentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        [ProducesResponseType(typeof(ApiResult<CommentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateCmtCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteCmtCommand { Id = id });
            if (!result.Succeeded) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("document/{id}")]
        [ProducesResponseType(typeof(ApiResult<PageList<CommentDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetByDocument(int id)
        {
            var result = await _mediator.Send(new GetCmtByDocIdQuery { Id = id });
            if (!result.Succeeded) return BadRequest(result);
            return Ok(result);
        }
    }
}
