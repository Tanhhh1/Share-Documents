using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Documents.Commands.AproveDocument;
using Application.CQRS.Documents.Commands.RejectDocument;
using Application.CQRS.Documents.DTOs;
using Application.CQRS.Documents.Queries.GetAllDocument;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Admin
{
    public class DocumentController : AdminApiController
    {
        private readonly IMediator _mediator;
        public DocumentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllDocumentQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("approve/{id}")]
        [ProducesResponseType(typeof(ApiResult<DocumentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Approve(int id)
        {
            var result = await _mediator.Send(new ApproveDocumentCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("reject/{id}")]
        [ProducesResponseType(typeof(ApiResult<DocumentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectDocumentCommand command)
        {
            if (id != command.Id)
                return BadRequest(ApiResult<DocumentDto>.Failure("Mã tài liệu không khớp"));

            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }
    }
}
