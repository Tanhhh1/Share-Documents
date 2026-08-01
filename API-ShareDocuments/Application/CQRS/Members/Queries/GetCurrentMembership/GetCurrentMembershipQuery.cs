using Application.Common;
using Application.CQRS.Members.DTOs;
using MediatR;

namespace Application.CQRS.Members.Queries.GetCurrentMembership
{
    public class GetCurrentMembershipQuery : IRequest<ApiResult<MembershipDto?>>
    {
    }
}
