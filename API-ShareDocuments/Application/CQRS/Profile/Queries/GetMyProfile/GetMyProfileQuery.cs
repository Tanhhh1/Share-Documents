using Application.Common;
using Application.CQRS.Profile.DTOs;
using MediatR;

namespace Application.CQRS.Profile.Queries.GetByUserId
{
    public class GetMyProfileQuery : IRequest<ApiResult<ProfileDto>>
    {
    }
}
