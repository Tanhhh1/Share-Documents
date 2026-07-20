using Application.Common;
using Application.CQRS.Majors.DTOs;
using MediatR;

namespace Application.CQRS.Majors.Commands.UpdateMajor
{
    public class UpdateMajorCommand : IRequest<ApiResult<MajorDto>>
    {
        public int Id { get; set; }
        public int FacultyId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
