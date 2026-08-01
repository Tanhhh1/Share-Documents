namespace Application.Interfaces.Services
{
    public interface ICurrentUser
    {
        int? Id { get; }
        string? Username { get; }
        string? Fullname { get; }
        string? Email { get; }
        bool IsAuthenticated { get; }
        bool IsAdmin { get; }
        bool IsModerator { get; }
    }
}
