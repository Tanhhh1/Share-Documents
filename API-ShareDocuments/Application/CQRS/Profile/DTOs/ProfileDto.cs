namespace Application.CQRS.Profile.DTOs
{
    public class ProfileDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
