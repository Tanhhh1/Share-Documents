using Application.Common;
using Application.CQRS.Majors.DTOs;
using MediatR;

namespace Application.CQRS.Majors.Commands.DeleteMajor
{
    public class DeleteMajorCommand : IRequest<ApiResult<MajorDto>>
    {
        public int Id { get; set; }
    }
}
