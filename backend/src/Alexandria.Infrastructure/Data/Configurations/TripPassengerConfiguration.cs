using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class TripPassengerConfiguration : IEntityTypeConfiguration<TripPassenger>
{
    public void Configure(EntityTypeBuilder<TripPassenger> builder)
    {
        builder.ToTable("TripPassengers");
        builder.HasKey(tp => tp.Id);
        builder.HasIndex(tp => tp.TripId);
        builder.HasOne(tp => tp.Booking).WithMany().HasForeignKey(tp => tp.BookingId).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(tp => tp.User).WithMany().HasForeignKey(tp => tp.UserId).OnDelete(DeleteBehavior.NoAction);
    }
}
