using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Faculties.Commands.CreateFaculty;
using Application.CQRS.Faculties.Commands.DeleteFaculty;
using Application.CQRS.Faculties.Commands.RestoreFaculty;
using Application.CQRS.Faculties.Commands.UpdateFaculty;
using Application.CQRS.Faculties.DTOs;
using Application.CQRS.Faculties.Queries.GetAllFaculty;
using Application.CQRS.Faculties.Queries.GetByFacultyId;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Admin
{
    public class FacultyController : AdminApiController
    {
        private readonly IMediator _mediator;
        public FacultyController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<PageList<FacultyDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<FacultyDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllFacultyQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResult<FacultyDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<FacultyDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetByFacultyIdQuery { Id = id });
            if (!result.Succeeded)
                return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResult<FacultyDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResult<FacultyDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateFacultyCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return CreatedAtAction(nameof(GetById), new { id = result.Result!.Id }, result);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResult<FacultyDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<FacultyDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateFacultyCommand command)
        {
            if (id != command.Id)
                return BadRequest(ApiResult<FacultyDto>.Failure("Mã Khoa không khớp"));

            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("delete/{id}")]
        [ProducesResponseType(typeof(ApiResult<FacultyDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<FacultyDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteFacultyCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("restore/{id}")]
        [ProducesResponseType(typeof(ApiResult<FacultyDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<FacultyDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Restore(int id)
        {
            var result = await _mediator.Send(new RestoreFacultyCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }
    }
}
