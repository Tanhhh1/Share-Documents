using Application.Common;
using Application.CQRS.Subjects.DTOs;
using MediatR;

namespace Application.CQRS.Subjects.Commands.DeleteSubject
{
    public class DeleteSubjectCommand : IRequest<ApiResult<SubjectDto>>
    {
        public int Id { get; set; }
    }
}
