using Application.Common;
using Application.CQRS.DocumentGroups.DTOs;
using MediatR;

namespace Application.CQRS.DocumentGroups.Commands.RestoreGroup
{
    public class RestoreGroupCommand : IRequest<ApiResult<DocumentGroupDto>>
    {
        public int Id { get; set; }
    }
}
