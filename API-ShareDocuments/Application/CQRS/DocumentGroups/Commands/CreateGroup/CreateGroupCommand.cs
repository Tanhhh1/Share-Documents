using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using MediatR;

namespace Application.CQRS.DocumentGroups.Commands.CreateGroup
{
    public class CreateGroupCommand : IRequest<ApiResult<DocumentGroupDto>>
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
