using Domain.Common;

namespace Domain.Entities
{
    public class Faculty : BaseEntity
    {
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; } = true;
    }
}
