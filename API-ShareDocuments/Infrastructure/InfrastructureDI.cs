using Application.Interfaces.Services;
using Application.Interfaces.UnitOfWork;
using Infrastructure.Configurations;
using Infrastructure.Persistences;
using Infrastructure.Services;
using Infrastructure.Services.Email;
using Infrastructure.Uow;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using PayOS;
using System.Net.Http.Headers;

namespace Infrastructure
{
    public static class InfrastructureDI
    {
        public static IServiceCollection AddInfrastructureConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            var section = configuration.GetSection("Database");
            services.Configure<DatabaseConfiguration>(section);
            var databaseConfig = section.Get<DatabaseConfiguration>();
            if (databaseConfig is null) throw new Exception("Database configuration not found! Please check 'appsettings.json' file again.");
            services
                .AddDbContext<DatabaseContext>(options =>
                    options.UseNpgsql(
                        databaseConfig.Main,
                        opt => opt.MigrationsAssembly(typeof(DatabaseContext).Assembly.FullName)));

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<ICurrentUser, CurrentUser>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IPayOSService, PayOSService>();
            services.AddScoped<IMemberService, MemberService>();
            services.AddMemoryCache();
            services.AddSingleton<IOtpService, OtpService>();
            services.AddScoped<IDomainEventDispatch, DomainEventDispatch>();

            var supabaseSection = configuration.GetSection("Supabase");
            services.Configure<SupabaseOptions>(supabaseSection);
            var supabaseConfig = supabaseSection.Get<SupabaseOptions>();
            if (supabaseConfig is null) throw new Exception("Supabase configuration not found! Please check 'appsettings.json' file again.");

            services.AddHttpClient("SupabaseStorage", (sp, client) =>
            {
                var options = sp.GetRequiredService<IOptions<SupabaseOptions>>().Value;
                client.BaseAddress = new Uri($"{options.Url}/storage/v1/");
                client.DefaultRequestHeaders.Add("apikey", options.SecretKey);
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", options.SecretKey);
            });

            services.AddScoped<ISupabaseStorageService, SupabaseStorageService>();
            services.Configure<EmailSettings>(configuration.GetSection(nameof(EmailSettings)));
            services.Configure<PayOSSettings>(configuration.GetSection(nameof(PayOSSettings)));

            services.AddSingleton(sp =>
            {
                var settings = sp.GetRequiredService<IOptions<PayOSSettings>>().Value;
                return new PayOSClient(new PayOSOptions
                {
                    ClientId = settings.ClientId,
                    ApiKey = settings.ApiKey,
                    ChecksumKey = settings.ChecksumKey
                });
            });
            return services;
        }
    }
}
