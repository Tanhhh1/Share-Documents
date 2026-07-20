using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class MajorConfiguration : IEntityTypeConfiguration<Major>
    {
        public void Configure(EntityTypeBuilder<Major> builder)
        {
            builder.ToTable("Majors");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.Name)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(m => m.IsActive)
                .HasDefaultValue(true)
                .IsRequired();

            builder.HasIndex(m => m.Name)
                .IsUnique();

            builder.HasOne(m => m.Faculty)
                .WithMany()
                .HasForeignKey(m => m.FacultyId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
