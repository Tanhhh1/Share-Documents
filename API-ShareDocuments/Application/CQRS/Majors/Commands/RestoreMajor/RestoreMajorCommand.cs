using Application.Common;
using Application.CQRS.Majors.DTOs;
using MediatR;

namespace Application.CQRS.Majors.Commands.RestoreMajor
{
    public class RestoreMajorCommand : IRequest<ApiResult<MajorDto>>
    {
        public int Id { get; set; }
    }
}
