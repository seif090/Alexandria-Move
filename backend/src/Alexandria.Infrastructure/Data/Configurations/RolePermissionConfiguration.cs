using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ToTable("RolePermissions");
        builder.HasKey(rp => rp.Id);
        builder.Property(rp => rp.PermissionGroup).IsRequired().HasMaxLength(100);
        builder.Property(rp => rp.PermissionName).IsRequired().HasMaxLength(100);
        builder.HasIndex(rp => rp.RoleId);
        builder.HasIndex(rp => new { rp.RoleId, rp.PermissionGroup, rp.PermissionName }).IsUnique();
    }
}
