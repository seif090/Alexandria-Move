using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("AuditLogs");
        builder.HasKey(al => al.Id);
        builder.Property(al => al.Action).IsRequired().HasMaxLength(100);
        builder.Property(al => al.EntityType).IsRequired().HasMaxLength(100);
        builder.Property(al => al.EntityId).HasMaxLength(100);
        builder.Property(al => al.IpAddress).HasMaxLength(50);
        builder.Property(al => al.OldValues).HasColumnType("nvarchar(max)");
        builder.Property(al => al.NewValues).HasColumnType("nvarchar(max)");
        builder.Property(al => al.AffectedFields).HasMaxLength(500);
        builder.HasIndex(al => al.UserId);
        builder.HasIndex(al => al.EntityType);
        builder.HasIndex(al => al.EntityId);
        builder.HasIndex(al => al.Timestamp);
    }
}
