using Application.Common;
using Application.CQRS.Majors.DTOs;
using MediatR;

namespace Application.CQRS.Majors.Commands.CreateMajor
{
    public class CreateMajorCommand : IRequest<ApiResult<MajorDto>>
    {
        public int FacultyId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
