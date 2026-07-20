using Application.Common;
using Application.CQRS.Subjects.DTOs;
using MediatR;

namespace Application.CQRS.Subjects.Commands.UpdateSubject
{
    public class UpdateSubjectCommand : IRequest<ApiResult<SubjectDto>>
    {
        public int Id { get; set; }
        public int EducationLevelId { get; set; }
        public int? MajorId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
