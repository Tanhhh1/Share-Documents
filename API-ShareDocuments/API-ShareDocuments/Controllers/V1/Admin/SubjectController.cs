using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Subjects.Commands.CreateSubject;
using Application.CQRS.Subjects.Commands.DeleteSubject;
using Application.CQRS.Subjects.Commands.RestoreSubject;
using Application.CQRS.Subjects.Commands.UpdateSubject;
using Application.CQRS.Subjects.DTOs;
using Application.CQRS.Subjects.Queries.GetAllSubject;
using Application.CQRS.Subjects.Queries.GetBySubjectId;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Admin
{
    public class SubjectController : AdminApiController
    {
        private readonly IMediator _mediator;
        public SubjectController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<PageList<SubjectDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<SubjectDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllSubjectQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResult<SubjectDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<SubjectDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetBySubjectIdQuery { Id = id });
            if (!result.Succeeded)
                return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResult<SubjectDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResult<SubjectDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateSubjectCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return CreatedAtAction(nameof(GetById), new { id = result.Result!.Id }, result);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResult<SubjectDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<SubjectDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSubjectCommand command)
        {
            if (id != command.Id)
                return BadRequest(ApiResult<SubjectDto>.Failure("Mã Môn học không khớp"));

            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("delete/{id}")]
        [ProducesResponseType(typeof(ApiResult<SubjectDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<SubjectDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteSubjectCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("restore/{id}")]
        [ProducesResponseType(typeof(ApiResult<SubjectDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<SubjectDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Restore(int id)
        {
            var result = await _mediator.Send(new RestoreSubjectCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }
    }
}
