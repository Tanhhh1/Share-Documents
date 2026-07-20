using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class EducationLevelConfiguration : IEntityTypeConfiguration<EducationLevel>
    {
        public void Configure(EntityTypeBuilder<EducationLevel> builder)
        {
            builder.ToTable("EducationLevels");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Name)
                .HasMaxLength(255)
                .IsRequired();

            builder.HasIndex(e => e.Name)
                .IsUnique();

            builder.HasData(
                new EducationLevel { Id = 1, Name = "Tiểu học" },
                new EducationLevel { Id = 2, Name = "Trung Học Cơ Sở" },
                new EducationLevel { Id = 3, Name = "Trung Học Phổ Thông" },
                new EducationLevel { Id = 4, Name = "Đại học" }
            );
        }
    }
}
