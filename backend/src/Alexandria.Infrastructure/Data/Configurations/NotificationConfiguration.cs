using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("Notifications");
        builder.HasKey(n => n.Id);
        builder.Property(n => n.Title).IsRequired().HasMaxLength(200);
        builder.Property(n => n.Body).HasMaxLength(2000);
        builder.Property(n => n.Data).HasColumnType("nvarchar(max)");
        builder.Property(n => n.Type).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.Property(n => n.Event).HasConversion<string>().HasMaxLength(30);
        builder.HasIndex(n => n.UserId);
        builder.HasIndex(n => n.IsRead);
        builder.HasIndex(n => n.SentAt);
    }
}
