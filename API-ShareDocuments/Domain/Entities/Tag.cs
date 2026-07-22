using Domain.Common;

namespace Domain.Entities
{
    public class Tag : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
    }
}
