namespace Application.Interfaces.Services
{
    public interface IMemberService
    {
        Task<bool> IsActiveMemberAsync(int userId, CancellationToken cancellationToken = default);
    }
}
