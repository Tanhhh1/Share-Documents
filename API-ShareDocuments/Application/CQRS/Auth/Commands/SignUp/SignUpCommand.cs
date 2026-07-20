using Application.Common;
using MediatR;

namespace Application.CQRS.Auth.Commands.SignUp
{
    public class SignUpCommand : IRequest<ApiResult<bool>>
    {
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
