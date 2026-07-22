using Domain.Common;

namespace Domain.Entities
{
    public class Major : BaseEntity
    {
        public int FacultyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public Faculty Faculty { get; set; } = null!;
    }
}
