using Application.Common;
using Application.CQRS.Tags.DTOs;
using MediatR;

namespace Application.CQRS.Tags.Commands.RestoreTag
{
    public class RestoreTagCommand : IRequest<ApiResult<TagDto>>
    {
        public int Id { get; set; }
    }
}
