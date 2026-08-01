namespace Application.Interfaces.Services
{
    public interface IOtpService
    {
        Task<string> GenerateOtpAsync(string email, CancellationToken cancellationToken = default);
        Task<bool> VerifyOtpAsync(string email, string otp, CancellationToken cancellationToken = default);
        Task RemoveOtpAsync(string email, CancellationToken cancellationToken = default);
    }
}
    