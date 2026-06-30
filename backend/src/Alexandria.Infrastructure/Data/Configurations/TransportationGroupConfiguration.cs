using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class TransportationGroupConfiguration : IEntityTypeConfiguration<TransportationGroup>
{
    public void Configure(EntityTypeBuilder<TransportationGroup> builder)
    {
        builder.ToTable("TransportationGroups");
        builder.HasKey(tg => tg.Id);
        builder.Property(tg => tg.Name).IsRequired().HasMaxLength(200);
        builder.Property(tg => tg.WorkingDays).HasMaxLength(100);
        builder.Property(tg => tg.Price).HasColumnType("decimal(18,2)");
        builder.Property(tg => tg.Status).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.HasOne(tg => tg.Community).WithMany(c => c.Groups).HasForeignKey(tg => tg.CommunityId).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(tg => tg.Route).WithMany(r => r.Groups).HasForeignKey(tg => tg.RouteId).OnDelete(DeleteBehavior.SetNull);
        builder.HasOne(tg => tg.Driver).WithMany(d => d.Groups).HasForeignKey(tg => tg.DriverId).OnDelete(DeleteBehavior.SetNull);
        builder.HasOne(tg => tg.Vehicle).WithMany(v => v.Groups).HasForeignKey(tg => tg.VehicleId).OnDelete(DeleteBehavior.SetNull);
        builder.HasMany(tg => tg.Bookings).WithOne(b => b.Group).HasForeignKey(b => b.GroupId).OnDelete(DeleteBehavior.Cascade);
    }
}
