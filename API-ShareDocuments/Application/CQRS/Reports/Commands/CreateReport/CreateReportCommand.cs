using Application.Common;
using MediatR;

namespace Application.CQRS.Reports.Commands.CreateReport
{
    public class CreateReportCommand : IRequest<ApiResult<bool>>
    {
        public int DocumentId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}
