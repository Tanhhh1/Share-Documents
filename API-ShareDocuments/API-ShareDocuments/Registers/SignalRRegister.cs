namespace API_ShareDocuments.Registers
{
    public static class SignalRRegister
    {
        public static void SignalRInjection(this IServiceCollection services)
        {
            services.AddSignalR(hubOptions =>
            {
                hubOptions.EnableDetailedErrors = true;
                hubOptions.MaximumReceiveMessageSize = null;
            })
                    .AddNewtonsoftJsonProtocol(opt =>
                        opt.PayloadSerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
        }
    }
}
