using Application.Common;
using Application.CQRS.Tags.DTOs;
using MediatR;

namespace Application.CQRS.Tags.Commands.CreateTag
{
    public class CreateTagCommand : IRequest<ApiResult<TagDto>>
    {
        public string Name { get; set; } = string.Empty;
    }
}
