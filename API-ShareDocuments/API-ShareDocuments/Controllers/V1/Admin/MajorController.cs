using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Majors.Commands.CreateMajor;
using Application.CQRS.Majors.Commands.DeleteMajor;
using Application.CQRS.Majors.Commands.RestoreMajor;
using Application.CQRS.Majors.Commands.UpdateMajor;
using Application.CQRS.Majors.DTOs;
using Application.CQRS.Majors.Queries.GetAllMajor;
using Application.CQRS.Majors.Queries.GetByMajorId;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Admin
{
    public class MajorController : AdminApiController
    {
        private readonly IMediator _mediator;
        public MajorController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<PageList<MajorDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<MajorDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllMajorQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResult<MajorDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<MajorDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetByMajorIdQuery { Id = id });
            if (!result.Succeeded)
                return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResult<MajorDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResult<MajorDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateMajorCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return CreatedAtAction(nameof(GetById), new { id = result.Result!.Id }, result);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResult<MajorDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<MajorDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMajorCommand command)
        {
            if (id != command.Id)
                return BadRequest(ApiResult<MajorDto>.Failure("Mã Ngành học không khớp"));

            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("delete/{id}")]
        [ProducesResponseType(typeof(ApiResult<MajorDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<MajorDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteMajorCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("restore/{id}")]
        [ProducesResponseType(typeof(ApiResult<MajorDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<MajorDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Restore(int id)
        {
            var result = await _mediator.Send(new RestoreMajorCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }
    }
}
