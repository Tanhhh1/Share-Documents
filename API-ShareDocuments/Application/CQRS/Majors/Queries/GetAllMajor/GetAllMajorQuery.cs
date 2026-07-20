using Application.Common;
using Application.CQRS.Majors.DTOs;
using MediatR;

namespace Application.CQRS.Majors.Queries.GetAllMajor
{
    public class GetAllMajorQuery : IRequest<ApiResult<PageList<MajorDto>>>
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int? FacultyId { get; set; }
        public string? Search { get; set; }
        public bool? IsActive { get; set; }
    }
}
