using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class RouteConfiguration : IEntityTypeConfiguration<Route>
{
    public void Configure(EntityTypeBuilder<Route> builder)
    {
        builder.ToTable("Routes");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(200);
        builder.Property(r => r.StartLocation).IsRequired().HasMaxLength(300);
        builder.Property(r => r.EndLocation).IsRequired().HasMaxLength(300);
        builder.Property(r => r.RouteCoordinates).HasColumnType("nvarchar(max)");
        builder.Property(r => r.Status).HasConversion<string>().HasMaxLength(30);
        builder.HasIndex(r => r.CommunityId);
        builder.HasIndex(r => r.Name);
        builder.HasMany(r => r.Stops).WithOne(s => s.Route).HasForeignKey(s => s.RouteId).OnDelete(DeleteBehavior.Cascade);
    }
}
