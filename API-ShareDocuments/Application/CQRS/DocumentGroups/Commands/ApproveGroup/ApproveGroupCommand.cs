using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using MediatR;

namespace Application.CQRS.DocumentGroups.Commands.ApproveGroup
{
    public class ApproveGroupCommand : IRequest<ApiResult<DocumentGroupDto>>
    {
        public int Id { get; set; }
    }
}
