using Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.Property(u => u.PasswordHash).HasColumnName("Password");

            builder.Property(u => u.PhoneNumber).HasColumnName("Phone"); 

            builder.Property(u => u.FullName)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(u => u.IsMember)
                .HasDefaultValue(false)
                .IsRequired();

            builder.Property(u => u.MemberExpiresAt)
                .IsRequired(false);

            builder.Property(u => u.IsActive)
                .HasDefaultValue(true)
                .IsRequired();
        }
    }
}
