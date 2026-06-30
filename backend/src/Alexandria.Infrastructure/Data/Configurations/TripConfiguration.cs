using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class TripConfiguration : IEntityTypeConfiguration<Trip>
{
    public void Configure(EntityTypeBuilder<Trip> builder)
    {
        builder.ToTable("Trips");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Status).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.Property(t => t.RouteJson).HasColumnType("nvarchar(max)");
        builder.Property(t => t.Notes).HasMaxLength(1000);
        builder.HasOne(t => t.Group).WithMany().HasForeignKey(t => t.GroupId).OnDelete(DeleteBehavior.NoAction);
        builder.HasIndex(t => t.ScheduledDate);
        builder.HasIndex(t => t.Status);
        builder.HasMany(t => t.PassengerConfirmations).WithOne(tp => tp.Trip).HasForeignKey(tp => tp.TripId).OnDelete(DeleteBehavior.Cascade);
    }
}
