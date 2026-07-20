using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Reports.DTOs;
using Application.CQRS.Reports.Queries.GetAllReport;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Admin
{
    public class ReportController : AdminApiController
    {
        private readonly IMediator _mediator;
        public ReportController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<PageList<ReportDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllReportQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded) return BadRequest(result);
            return Ok(result);
        }
    }
}
