using Application.Common;
using Application.CQRS.Subjects.DTOs;
using MediatR;

namespace Application.CQRS.Subjects.Commands.RestoreSubject
{
    public class RestoreSubjectCommand : IRequest<ApiResult<SubjectDto>>
    {
        public int Id { get; set; }
    }
}
