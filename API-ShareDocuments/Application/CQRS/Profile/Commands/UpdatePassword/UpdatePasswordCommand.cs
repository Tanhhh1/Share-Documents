using Application.Common;
using MediatR;

namespace Application.CQRS.Profile.Commands.UpdatePassword
{
    public class UpdatePasswordCommand : IRequest<ApiResult<bool>>
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }
}
