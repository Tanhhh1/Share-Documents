using API_ShareDocuments.Configurations;
using Application.Hubs;
using Asp.Versioning;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.Kestrel.Core;

namespace API_ShareDocuments.Registers
{
    public static class GeneralRegister
    {
        public static void RegisterGeneralServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.ConfigOption(configuration);
            services.VersionApiInjection();
            services.IdentityInjection();
            services.JwtInjection(configuration);
            services.AddRateLimitingPolicies();
        }

        public static void RegisterGeneralApp(this WebApplication app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionHandlingMiddleware>();
            app.UseRouting();
            app.UseCors(CorsRegister.PolicyName);
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseRateLimiter();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.MapControllers();
            app.MapHub<NotificationHub>("/hubs/notifications");
        }

        private static void VersionApiInjection(this IServiceCollection services)
        {
            services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1);
                options.ReportApiVersions = true;
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ApiVersionReader = ApiVersionReader.Combine(
                    new UrlSegmentApiVersionReader(),
                    new HeaderApiVersionReader("X-Api-Version"));
            }).AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'V";
                options.SubstituteApiVersionInUrl = true;
            });
        }

        private static void ConfigOption(this IServiceCollection services, IConfiguration configuration)
        {
            services.CorsInjection(configuration);
            services.Configure<FormOptions>(x =>
            {
                x.ValueCountLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = 83886080;
                x.MultipartHeadersLengthLimit = 83886080;
            });

            services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = int.MaxValue;
            });

            services.SignalRInjection();
        }
    }
}