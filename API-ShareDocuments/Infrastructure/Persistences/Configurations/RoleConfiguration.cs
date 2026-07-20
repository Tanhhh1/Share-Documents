using Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistences.Configurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("Roles");

            builder.Property(r => r.Id).HasColumnName("RoleId");
            builder.Property(r => r.Name).HasColumnName("RoleName");

            builder.HasData(
                new Role { Id = 1, Name = "Admin", NormalizedName = "ADMIN" },
                new Role { Id = 2, Name = "Moderator", NormalizedName = "MODERATOR" },
                new Role { Id = 3, Name = "User", NormalizedName = "USER" }
            );
        }
    }
}
