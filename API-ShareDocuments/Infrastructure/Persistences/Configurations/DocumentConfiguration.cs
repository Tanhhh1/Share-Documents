using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class DocumentConfiguration : IEntityTypeConfiguration<Document>
    {
        public void Configure(EntityTypeBuilder<Document> builder)
        {
            builder.ToTable("Documents");

            builder.HasKey(d => d.Id);

            builder.Property(d => d.Title)
                .HasMaxLength(500)
                .IsRequired();

            builder.Property(d => d.Description)
                .HasMaxLength(2000)
                .IsRequired(false);

            builder.Property(d => d.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(d => d.AccessLevel)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(d => d.ViewCount)
                .HasDefaultValue(0)
                .IsRequired();

            builder.Property(d => d.DownloadCount)
                .HasDefaultValue(0)
                .IsRequired();

            builder.Property(d => d.IsDeleted)
                .HasDefaultValue(false)
                .IsRequired();

            builder.Property(d => d.FileName)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(d => d.FileType)
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(d => d.FileSizeBytes)
                .IsRequired();

            builder.Property(d => d.S3Key)
                .HasMaxLength(1000)
                .IsRequired();

            builder.Property(d => d.PreviewPdfKey)
                .HasMaxLength(1000)
                .IsRequired(false);

            builder.Property(d => d.ConversionStatus)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.HasIndex(d => d.S3Key)
                .IsUnique();

            builder.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(d => d.Group)
                .WithMany(g => g.Documents)
                .HasForeignKey(d => d.GroupId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            builder.HasOne(d => d.Subject)
                .WithMany()
                .HasForeignKey(d => d.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(d => d.Tags)
                .WithMany()
                .UsingEntity(j => j.ToTable("DocumentTags"));

            builder.HasIndex(d => d.Status);
            builder.HasIndex(d => d.SubjectId);
        }
    }
}