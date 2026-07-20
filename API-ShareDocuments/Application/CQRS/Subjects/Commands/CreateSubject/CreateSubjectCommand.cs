using Application.Common;
using Application.CQRS.Subjects.DTOs;
using MediatR;

namespace Application.CQRS.Subjects.Commands.CreateSubject
{
    public class CreateSubjectCommand : IRequest<ApiResult<SubjectDto>>
    {
        public int EducationLevelId { get; set; }
        public int? MajorId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
