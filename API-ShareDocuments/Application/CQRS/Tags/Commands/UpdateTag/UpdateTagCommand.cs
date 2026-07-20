using Application.Common;
using Application.CQRS.Tags.DTOs;
using MediatR;

namespace Application.CQRS.Tags.Commands.UpdateTag
{
    public class UpdateTagCommand : IRequest<ApiResult<TagDto>>
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
