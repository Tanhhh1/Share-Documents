namespace API_ShareDocuments.Registers
{
    public static class CorsRegister
    {
        public const string PolicyName = "ApiShareDocuments";

        public static void CorsInjection(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddCors(options =>
            {
                var withOrigins = configuration.GetSection("ServerSetting:WithOrigins").Get<string[]>();

                if (withOrigins is null || withOrigins.Length == 0)
                {
                    var singleOrigin = configuration.GetValue<string>("ServerSetting:WithOrigins");
                    if (!string.IsNullOrEmpty(singleOrigin))
                    {
                        withOrigins = [singleOrigin];
                    }
                }

                options.AddPolicy(PolicyName, policy =>
                {
                    policy.WithOrigins(withOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });
        }
    }
}
