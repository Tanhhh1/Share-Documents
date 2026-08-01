using Application.Common;
using MediatR;

namespace Application.CQRS.Auth.Commands.ForgotPassword
{
    public class ForgotPasswordCommand : IRequest<ApiResult<string>>
    {
        public string Email { get; set; } = string.Empty;
    }
}
