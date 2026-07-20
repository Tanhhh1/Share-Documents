using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class ModerationLogConfiguration : IEntityTypeConfiguration<ModerationLog>
    {
        public void Configure(EntityTypeBuilder<ModerationLog> builder)
        {
            builder.ToTable("ModerationLogs");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.Type)
                .HasConversion<string>()
                .HasMaxLength(30)
                .IsRequired();

            builder.Property(m => m.TargetId)
                .IsRequired();

            builder.Property(m => m.Action)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(m => m.Reason)
                .HasMaxLength(1000)
                .IsRequired(false);

            builder.HasOne(m => m.User)
                .WithMany()
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
