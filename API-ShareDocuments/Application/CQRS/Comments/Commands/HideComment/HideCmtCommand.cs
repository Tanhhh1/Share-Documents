using Application.Common;
using MediatR;

namespace Application.CQRS.Comments.Commands.HideComment
{
    public class HideCmtCommand : IRequest<ApiResult<bool>>
    {
        public int Id { get; set; }
    }
}
