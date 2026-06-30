using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class DriverConfiguration : IEntityTypeConfiguration<Driver>
{
    public void Configure(EntityTypeBuilder<Driver> builder)
    {
        builder.ToTable("Drivers");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.LicenseNumber).IsRequired().HasMaxLength(50);
        builder.HasIndex(d => d.LicenseNumber).IsUnique();
        builder.Property(d => d.LicenseImageUrl).HasMaxLength(500);
        builder.Property(d => d.Status).HasMaxLength(30);
        builder.HasOne(d => d.User).WithMany().HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.NoAction);
        builder.HasMany(d => d.Documents).WithOne(dd => dd.Driver).HasForeignKey(dd => dd.DriverId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(d => d.Trips).WithOne(t => t.Driver).HasForeignKey(t => t.DriverId).OnDelete(DeleteBehavior.SetNull);
    }
}
