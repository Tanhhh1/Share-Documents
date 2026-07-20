using Application.Common;
using Application.CQRS.Faculties.DTOs;
using MediatR;

namespace Application.CQRS.Faculties.Commands.UpdateFaculty
{
    public class UpdateFacultyCommand : IRequest<ApiResult<FacultyDto>>
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
