using Application.Common;
using MediatR;

namespace Application.CQRS.Profile.Commands.UpdatePassword
{
    public class UpdatePasswordCommand : IRequest<ApiResult<bool>>
    {
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
        public string ConfirmNewPassword { get; set; } = null!;
    }
}
