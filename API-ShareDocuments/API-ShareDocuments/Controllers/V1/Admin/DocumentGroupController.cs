using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.DocumentGroups.Commands.ApproveGroup;
using Application.CQRS.DocumentGroups.Commands.RejectGroup;
using Application.CQRS.DocumentGroups.DTOs;
using Application.CQRS.DocumentGroups.Queries.GetAllGroup;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Admin
{
    public class DocumentGroupController : AdminApiController
    {
        private readonly IMediator _mediator;
        public DocumentGroupController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentGroupDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentGroupDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllGroupQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("approve/{id}")]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Approve(int id)
        {
            var result = await _mediator.Send(new ApproveGroupCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("reject/{id}")]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentGroupDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectGroupCommand command)
        {
            if (id != command.Id)
                return BadRequest(ApiResult<DocumentGroupDto>.Failure("Mã nhóm chủ đề không khớp"));

            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }
    }
}
