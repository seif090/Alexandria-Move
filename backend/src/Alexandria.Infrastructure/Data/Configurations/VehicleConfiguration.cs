using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.ToTable("Vehicles");
        builder.HasKey(v => v.Id);
        builder.Property(v => v.PlateNumber).IsRequired().HasMaxLength(20);
        builder.HasIndex(v => v.PlateNumber).IsUnique();
        builder.Property(v => v.Model).IsRequired().HasMaxLength(100);
        builder.Property(v => v.Brand).IsRequired().HasMaxLength(100);
        builder.Property(v => v.Color).HasMaxLength(50);
        builder.Property(v => v.InsuranceNumber).HasMaxLength(100);
        builder.Property(v => v.Status).HasMaxLength(30);
        builder.HasIndex(v => v.OwnerId);
        builder.HasOne(v => v.Owner).WithMany().HasForeignKey(v => v.OwnerId).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(v => v.Driver).WithMany().HasForeignKey(v => v.DriverId).OnDelete(DeleteBehavior.NoAction);
        builder.HasMany(v => v.Documents).WithOne(vd => vd.Vehicle).HasForeignKey(vd => vd.VehicleId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(v => v.MaintenanceRecords).WithOne(mr => mr.Vehicle).HasForeignKey(mr => mr.VehicleId).OnDelete(DeleteBehavior.Cascade);
    }
}
