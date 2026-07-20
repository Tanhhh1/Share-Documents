using Application.Common;
using Application.CQRS.Faculties.DTOs;
using MediatR;

namespace Application.CQRS.Faculties.Queries.GetByFacultyId
{
    public class GetByFacultyIdQuery : IRequest<ApiResult<FacultyDto>>
    {
        public int Id { get; set; }
    }
}
