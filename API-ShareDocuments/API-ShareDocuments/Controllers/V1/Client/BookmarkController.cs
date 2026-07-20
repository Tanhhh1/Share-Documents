using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Bookmarks.Commands.DeleteBookmark;
using Application.CQRS.Bookmarks.Commands.SaveBookmark;
using Application.CQRS.Bookmarks.DTOs;
using Application.CQRS.Bookmarks.Queries.GetBookmarkByUserId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Client
{
    [Authorize(Roles = "User")]
    public class BookmarkController : ApiController
    {
        private readonly IMediator _mediator;
        public BookmarkController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Save([FromBody] SaveBookmarkCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteBookmarkCommand { Id = id });
            if (!result.Succeeded) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<PageList<BookmarkDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetByUser([FromQuery] GetBookmarksByUserIdQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded) return BadRequest(result);
            return Ok(result);
        }
    }
}
