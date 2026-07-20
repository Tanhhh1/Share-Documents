using Application.Common;
using Application.CQRS.Subjects.DTOs;
using MediatR;

namespace Application.CQRS.Subjects.Queries.GetBySubjectId
{
    public class GetBySubjectIdQuery : IRequest<ApiResult<SubjectDto>>
    {
        public int Id { get; set; }
    }
}
