using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class FacultyConfiguration : IEntityTypeConfiguration<Faculty>
    {
        public void Configure(EntityTypeBuilder<Faculty> builder)
        {
            builder.ToTable("Faculties");

            builder.HasKey(f => f.Id);

            builder.Property(f => f.Name)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(f => f.IsActive)
                .HasDefaultValue(true)
                .IsRequired();

            builder.HasIndex(f => f.Name)
                .IsUnique();
        }
    }
}
