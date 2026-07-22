namespace Application.CQRS.Profile.DTOs
{
    public class ProfileDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
