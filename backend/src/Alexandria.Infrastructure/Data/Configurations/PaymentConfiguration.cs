using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Amount).IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(p => p.Method).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.Property(p => p.Status).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.Property(p => p.TransactionId).HasMaxLength(200);
        builder.Property(p => p.InvoiceNumber).HasMaxLength(100);
        builder.HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(p => p.Booking).WithMany().HasForeignKey(p => p.BookingId).OnDelete(DeleteBehavior.NoAction);
        builder.HasIndex(p => p.TransactionId).IsUnique().HasFilter("[TransactionId] IS NOT NULL");
    }
}
