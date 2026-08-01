using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.DocumentGroups.Queries.GetPublishedGroup;
using Application.CQRS.Documents.Commands.CreateDocument;
using Application.CQRS.Documents.Commands.DeleteDocument;
using Application.CQRS.Documents.Commands.DownloadDocument;
using Application.CQRS.Documents.Commands.RestoreDocument;
using Application.CQRS.Documents.Commands.UpdateDocument;
using Application.CQRS.Documents.DTOs;
using Application.CQRS.Documents.Queries.GetByDocumentId;
using Application.CQRS.Documents.Queries.GetDocumentPreview;
using Application.CQRS.Documents.Queries.GetMyDocument;
using Application.CQRS.Documents.Queries.GetPublishedDocument;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Client
{
    public class DocumentController : ApiController
    {
        private readonly IMediator _mediator;
        public DocumentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetPublished([FromQuery] GetPublishedDocumentQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResult<DocumentDetailDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentDetailDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetByDocumentIdQuery { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("my/documents")]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<DocumentDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetMine([FromQuery] GetMyDocumentQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(ApiResult<DocumentDetailDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResult<DocumentDetailDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromForm] CreateDocumentCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return StatusCode(StatusCodes.Status201Created, result);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResult<DocumentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDocumentCommand command)
        {
            if (id != command.Id)
                return BadRequest(ApiResult<DocumentDto>.Failure("Mã tài liệu không khớp"));

            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        [ProducesResponseType(typeof(ApiResult<DocumentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteDocumentCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("restore/{id}")]
        [ProducesResponseType(typeof(ApiResult<DocumentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Restore(int id)
        {
            var result = await _mediator.Send(new RestoreDocumentCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}/preview/{fileId}")]
        [ProducesResponseType(typeof(ApiResult<DocumentFileUrlDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentFileUrlDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Preview(int id, int fileId)
        {
            var result = await _mediator.Send(new GetDocumentPreviewQuery { DocumentId = id, FileId = fileId });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}/download/{fileId}")]
        [ProducesResponseType(typeof(ApiResult<DocumentFileUrlDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<DocumentFileUrlDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Download(int id, int fileId)
        {
            var result = await _mediator.Send(new DownloadDocumentFileCommand { DocumentId = id, FileId = fileId });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }
    }
}
