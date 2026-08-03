using Application.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Shared.Identity;
using System.Text;
using System.Text.Json;

namespace API_ShareDocuments.Registers
{
    public static class JwtRegister
    {
        public static void JwtInjection(this IServiceCollection services, IConfiguration configuration)
        {
            var secretKey = configuration.GetValue<string>("JwtConfiguration:SecretKey");
            if (string.IsNullOrWhiteSpace(secretKey))
            {
                throw new InvalidOperationException("JwtConfiguration:SecretKey is missing. Add 'JwtConfiguration:SecretKey' to appsettings.json or provide it via environment variables.");
            }

            services.Configure<JwtSetting>(configuration.GetSection("JwtConfiguration"));
            var key = Encoding.UTF8.GetBytes(secretKey);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddJwtBearer(options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    },
                    OnChallenge = async context =>
                    {
                        context.HandleResponse();
                        var message = context.AuthenticateFailure?.GetType().Name switch
                        {
                            "SecurityTokenExpiredException" => "Token đã hết hạn, vui lòng đăng nhập lại",
                            "SecurityTokenInvalidSignatureException" => "Token không hợp lệ",
                            "SecurityTokenNotFoundException" => "Không tìm thấy token",
                            _ => "Bạn chưa đăng nhập"
                        };
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";
                        var response = ApiResult<object>.Failure(message);
                        await context.Response.WriteAsync(
                            JsonSerializer.Serialize(response, new JsonSerializerOptions
                            {
                                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                            })
                        );
                    },
                    OnForbidden = async context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        context.Response.ContentType = "application/json";

                        var response = ApiResult<object>.Failure("Bạn không có quyền thực hiện chức năng này");
                        await context.Response.WriteAsync(
                            JsonSerializer.Serialize(response, new JsonSerializerOptions
                            {
                                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                            })
                        );
                    },
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"Auth failed: {context.Exception.GetType().Name}: {context.Exception.Message}");
                        return Task.CompletedTask;
                    },
                };
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = configuration["JwtConfiguration:ValidIssuer"],
                    ValidateAudience = true,
                    ValidAudience = configuration["JwtConfiguration:ValidAudience"],
                    ValidateLifetime = false,
                    ClockSkew = TimeSpan.Zero
                };
            });
        }
    }
}
