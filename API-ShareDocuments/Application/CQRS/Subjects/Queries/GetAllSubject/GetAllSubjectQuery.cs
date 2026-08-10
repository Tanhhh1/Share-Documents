using Application.Common;
using Application.CQRS.Subjects.DTOs;
using Domain.Enums;
using MediatR;

namespace Application.CQRS.Subjects.Queries.GetAllSubject
{
    public class GetAllSubjectQuery : IRequest<ApiResult<PageList<SubjectDto>>>
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public EducationLevel? EducationLevel { get; set; }
        public int? MajorId { get; set; }
        public string? Search { get; set; }
        public bool? IsActive { get; set; }
    }
}
