using Application.Common;
using Application.CQRS.Faculties.DTOs;
using MediatR;

namespace Application.CQRS.Faculties.Commands.CreateFaculty
{
    public class CreateFacultyCommand : IRequest<ApiResult<FacultyDto>>
    {
        public string Name { get; set; } = string.Empty;
    }
}
