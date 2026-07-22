using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using MediatR;

namespace Application.CQRS.DocumentGroups.Commands.UpdateGroup
{
    public class UpdateGroupCommand : IRequest<ApiResult<DocumentGroupDto>>
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
