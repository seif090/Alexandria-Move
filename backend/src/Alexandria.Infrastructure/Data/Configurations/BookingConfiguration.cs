using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("Bookings");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Status).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.Property(b => b.PaymentMethod).HasConversion<string>().HasMaxLength(30);
        builder.Property(b => b.PaymentStatus).HasConversion<string>().HasMaxLength(30);
        builder.Property(b => b.TotalPrice).HasColumnType("decimal(18,2)");
        builder.Property(b => b.QrCodeToken).HasMaxLength(500);
        builder.HasOne(b => b.User).WithMany().HasForeignKey(b => b.UserId).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(b => b.Group).WithMany().HasForeignKey(b => b.GroupId).OnDelete(DeleteBehavior.NoAction);
        builder.HasIndex(b => b.Status);
    }
}
