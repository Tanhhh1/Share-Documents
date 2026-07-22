using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using MediatR;

namespace Application.CQRS.DocumentGroups.Commands.RejectGroup
{
    public class RejectGroupCommand : IRequest<ApiResult<DocumentGroupDto>>
    {
        public int Id { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
