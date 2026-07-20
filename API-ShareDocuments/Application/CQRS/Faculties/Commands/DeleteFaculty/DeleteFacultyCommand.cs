using Application.Common;
using Application.CQRS.Faculties.DTOs;
using MediatR;

namespace Application.CQRS.Faculties.Commands.DeleteFaculty
{
    public class DeleteFacultyCommand : IRequest<ApiResult<FacultyDto>>
    {
        public int Id { get; set; }
    }
}
