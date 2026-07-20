using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class DocumentFileConfiguration : IEntityTypeConfiguration<DocumentFile>
    {
        public void Configure(EntityTypeBuilder<DocumentFile> builder)
        {
            builder.ToTable("DocumentFiles");

            builder.HasKey(df => df.Id);

            builder.Property(df => df.FileName)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(df => df.FileType)
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(df => df.FileSizeBytes)
                .IsRequired();

            builder.Property(df => df.S3Key)
                .HasMaxLength(1000)
                .IsRequired();

            builder.Property(df => df.PreviewPdfKey)
                .HasMaxLength(1000)
                .IsRequired(false);

            builder.HasIndex(df => df.S3Key)
                .IsUnique();
        }
    }
}
