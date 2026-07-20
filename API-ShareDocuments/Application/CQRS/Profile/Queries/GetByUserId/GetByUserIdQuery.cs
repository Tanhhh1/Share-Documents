using Application.Common;
using Application.CQRS.Profile.DTOs;
using MediatR;

namespace Application.CQRS.Profile.Queries.GetByUserId
{
    public class GetByUserIdQuery : IRequest<ApiResult<ProfileDto>>
    {
    }
}
