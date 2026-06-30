using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class MaintenanceRecordConfiguration : IEntityTypeConfiguration<MaintenanceRecord>
{
    public void Configure(EntityTypeBuilder<MaintenanceRecord> builder)
    {
        builder.ToTable("MaintenanceRecords");
        builder.HasKey(mr => mr.Id);
        builder.Property(mr => mr.Description).HasMaxLength(1000);
        builder.Property(mr => mr.Cost).HasColumnType("decimal(18,2)");
        builder.Property(mr => mr.ServiceProvider).HasMaxLength(200);
        builder.HasIndex(mr => mr.VehicleId);
        builder.HasIndex(mr => mr.MaintenanceDate);
    }
}
