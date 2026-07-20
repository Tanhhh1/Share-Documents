using Application.Common;
using Application.CQRS.Profile.DTOs;
using MediatR;

namespace Application.CQRS.Profile.Commands.UpdateInformation
{
    public class UpdateInforCommand : IRequest<ApiResult<ProfileDto>>
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }
}
