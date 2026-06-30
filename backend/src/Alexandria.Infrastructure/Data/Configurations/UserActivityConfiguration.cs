using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class UserActivityConfiguration : IEntityTypeConfiguration<UserActivity>
{
    public void Configure(EntityTypeBuilder<UserActivity> builder)
    {
        builder.ToTable("UserActivities");
        builder.HasKey(ua => ua.Id);
        builder.Property(ua => ua.ActivityType).IsRequired().HasMaxLength(100);
        builder.Property(ua => ua.Description).HasMaxLength(500);
        builder.Property(ua => ua.IpAddress).HasMaxLength(50);
        builder.HasIndex(ua => ua.UserId);
        builder.HasIndex(ua => ua.Timestamp);
    }
}
