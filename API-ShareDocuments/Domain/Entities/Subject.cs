using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Subject : BaseEntity
    {
        public int? MajorId { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public EducationLevel EducationLevel { get; set; }
        public Major? Major { get; set; }
    }
}
