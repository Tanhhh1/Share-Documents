using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Comments.Commands.HideComment;
using Application.CQRS.Comments.DTOs;
using Application.CQRS.Comments.Queries.GetAllCmt;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Admin
{
    public class CommentController : AdminApiController
    {
        private readonly IMediator _mediator;
        public CommentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<PageList<ListCommentDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<ListCommentDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllcommentQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("hide/{id}")]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Hide(int id)
        {
            var result = await _mediator.Send(new HideCommentCommand { Id = id });
            if (!result.Succeeded) return BadRequest(result);
            return Ok(result);
        }
    }
}
