using Application.Common;
using Application.CQRS.Tags.DTOs;
using MediatR;

namespace Application.CQRS.Tags.Commands.DeleteTag
{
    public class DeleteTagCommand : IRequest<ApiResult<TagDto>>
    {
        public int Id { get; set; }
    }
}
