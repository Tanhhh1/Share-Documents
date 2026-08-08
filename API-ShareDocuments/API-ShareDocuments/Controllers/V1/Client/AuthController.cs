using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Auth.Commands.ForgotPassword;
using Application.CQRS.Auth.Commands.RefreshToken;
using Application.CQRS.Auth.Commands.ResetPassword;
using Application.CQRS.Auth.Commands.RevokeToken;
using Application.CQRS.Auth.Commands.SignIn;
using Application.CQRS.Auth.Commands.SignUp;
using Application.CQRS.Auth.Commands.VerifyOtp;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Client
{
    public class AuthController : ApiController
    {
        private const string RefreshTokenCookieName = "refreshToken";
        private const string RefreshTokenCookiePath = "/api/v1/auth";

        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _env;

        public AuthController(IMediator mediator, IWebHostEnvironment env)
        {
            _mediator = mediator;
            _env = env;
        }

        [HttpPost("sign-up")]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SignUp([FromBody] SignUpCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("sign-in")]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SignIn([FromBody] SignInCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded) return BadRequest(result);

            SetRefreshTokenCookie(result.Result!.RefreshToken, result.Result.RefreshTokenExpires);

            var response = ApiResult<object>.Success(new
            {
                result.Result.AccessToken,
                result.Result.AccessTokenExpires
            });
            return Ok(response);
        }

        [HttpPost("revoke")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RevokeToken()
        {
            var refreshToken = Request.Cookies[RefreshTokenCookieName];

            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _mediator.Send(new RevokeTokenCommand { RefreshToken = refreshToken });
            }

            DeleteRefreshTokenCookie();
            return Ok(ApiResult<bool>.Success(true));
        }

        [HttpPost("refresh")]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies[RefreshTokenCookieName];

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(ApiResult<object>.Failure("Refresh token không hợp lệ hoặc đã hết hạn"));

            var result = await _mediator.Send(new RefreshTokenCommand { RefreshToken = refreshToken });

            if (!result.Succeeded)
            {
                DeleteRefreshTokenCookie();
                return BadRequest(result);
            }

            SetRefreshTokenCookie(result.Result!.RefreshToken, result.Result.RefreshTokenExpires);

            var response = ApiResult<object>.Success(new
            {
                result.Result.AccessToken,
                result.Result.AccessTokenExpires
            });
            return Ok(response);
        }

        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(ApiResult<string>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<string>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("verify-otp")]
        [ProducesResponseType(typeof(ApiResult<string>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<string>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("reset-password")]
        [ProducesResponseType(typeof(ApiResult<string>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<string>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        private void SetRefreshTokenCookie(string token, DateTime expires)
        {
            Response.Cookies.Append(RefreshTokenCookieName, token, new CookieOptions
            {
                HttpOnly = true,
                Secure = !_env.IsDevelopment(),
                SameSite = SameSiteMode.Lax,
                Expires = expires,
                Path = RefreshTokenCookiePath
            });
        }

        private void DeleteRefreshTokenCookie()
        {
            Response.Cookies.Delete(RefreshTokenCookieName, new CookieOptions
            {
                Path = RefreshTokenCookiePath
            });
        }
    }
}