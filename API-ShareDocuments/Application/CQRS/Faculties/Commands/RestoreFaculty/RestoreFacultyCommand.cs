using Application.Common;
using Application.CQRS.Faculties.DTOs;
using MediatR;

namespace Application.CQRS.Faculties.Commands.RestoreFaculty
{
    public class RestoreFacultyCommand : IRequest<ApiResult<FacultyDto>>
    {
        public int Id { get; set; }
    }
}
