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

            builder.Property(s => s.EducationLevel)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.HasOne(s => s.Major)
                .WithMany()
                .HasForeignKey(s => s.MajorId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
