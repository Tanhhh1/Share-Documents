namespace Application.CQRS.Subjects.DTOs
{
    public class SubjectDto
    {
        public int Id { get; set; }
        public int EducationLevelId { get; set; }
        public int? MajorId { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
