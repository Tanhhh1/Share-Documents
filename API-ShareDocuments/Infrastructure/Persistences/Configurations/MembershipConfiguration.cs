using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class MembershipConfiguration : IEntityTypeConfiguration<Membership>
    {
        public void Configure(EntityTypeBuilder<Membership> builder)
        {
            builder.ToTable("Memberships");

            builder.HasKey(ms => ms.Id);

            builder.Property(ms => ms.Price)
                .HasPrecision(18, 2)
                .IsRequired();

            builder.Property(ms => ms.PlanCode)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(ms => ms.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(ms => ms.StartDate)
                .IsRequired();

            builder.Property(ms => ms.EndDate)
                .IsRequired();

            builder.HasOne(ms => ms.User)
                .WithMany()
                .HasForeignKey(ms => ms.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ms => ms.Payment)
                .WithOne()
                .HasForeignKey<Membership>(ms => ms.PaymentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(ms => new { ms.UserId, ms.Status });
        }
    }
}