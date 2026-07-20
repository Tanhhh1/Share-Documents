using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class SubjectConfiguration : IEntityTypeConfiguration<Subject>
    {
        public void Configure(EntityTypeBuilder<Subject> builder)
        {
            builder.ToTable("Subjects");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Name)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(s => s.IsActive)
                .HasDefaultValue(true)
                .IsRequired();

            builder.HasIndex(s => s.Name)
                .IsUnique();

            builder.HasOne(s => s.EducationLevel)
                .WithMany()
                .HasForeignKey(s => s.EducationLevelId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(s => s.Major)
                .WithMany()
                .HasForeignKey(s => s.MajorId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
