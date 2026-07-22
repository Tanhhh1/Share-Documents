using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using MediatR;

namespace Application.CQRS.DocumentGroups.Commands.DeleteGroup
{
    public class DeleteGroupCommand : IRequest<ApiResult<DocumentGroupDto>>
    {
        public int Id { get; set; }
    }
}
