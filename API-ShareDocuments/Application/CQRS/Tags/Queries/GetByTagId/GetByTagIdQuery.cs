using Application.Common;
using Application.CQRS.Tags.DTOs;
using MediatR;

namespace Application.CQRS.Tags.Queries.GetByTagId
{
    public class GetByTagIdQuery : IRequest<ApiResult<TagDto>>
    {
        public int Id { get; set; }
    }
}
