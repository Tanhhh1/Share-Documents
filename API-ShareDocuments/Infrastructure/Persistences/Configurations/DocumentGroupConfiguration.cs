using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class DocumentGroupConfiguration : IEntityTypeConfiguration<DocumentGroup>
    {
        public void Configure(EntityTypeBuilder<DocumentGroup> builder)
        {
            builder.ToTable("DocumentGroups");

            builder.HasKey(dg => dg.Id);

            builder.Property(dg => dg.Title)
                .HasMaxLength(500)
                .IsRequired();

            builder.Property(dg => dg.Description)
                .HasMaxLength(2000)
                .IsRequired(false);

            builder.Property(dg => dg.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(dg => dg.IsDeleted)
                .HasDefaultValue(false)
                .IsRequired();

            builder.Property(dg => dg.DeletedAt)
                .IsRequired(false);

            builder.HasOne(dg => dg.User)
                .WithMany()
                .HasForeignKey(dg => dg.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
