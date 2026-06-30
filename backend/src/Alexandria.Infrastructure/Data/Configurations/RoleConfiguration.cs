using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(100);
        builder.HasIndex(r => r.Name).IsUnique();
        builder.Property(r => r.Description).HasMaxLength(500);
        builder.HasMany(r => r.Permissions).WithOne(p => p.Role).HasForeignKey(p => p.RoleId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(r => r.Users).WithOne(ur => ur.Role).HasForeignKey(ur => ur.RoleId).OnDelete(DeleteBehavior.Cascade);
    }
}
