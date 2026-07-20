using Application.Common;
using Application.CQRS.Majors.DTOs;
using MediatR;

namespace Application.CQRS.Majors.Queries.GetByMajorId
{
    public class GetByMajorIdQuery : IRequest<ApiResult<MajorDto>>
    {
        public int Id { get; set; }
    }
}
