using Application.Common;
using Application.CQRS.Faculties.DTOs;
using MediatR;

namespace Application.CQRS.Faculties.Queries.GetAllFaculty
{
    public class GetAllFacultyQuery : IRequest<ApiResult<PageList<FacultyDto>>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string? Search { get; set; }
        public bool? IsActive { get; set; }
    }
}
