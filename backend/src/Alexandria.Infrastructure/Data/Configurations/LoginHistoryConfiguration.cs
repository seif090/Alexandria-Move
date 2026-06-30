using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class LoginHistoryConfiguration : IEntityTypeConfiguration<LoginHistory>
{
    public void Configure(EntityTypeBuilder<LoginHistory> builder)
    {
        builder.ToTable("LoginHistories");
        builder.HasKey(lh => lh.Id);
        builder.Property(lh => lh.IpAddress).HasMaxLength(50);
        builder.Property(lh => lh.UserAgent).HasMaxLength(500);
        builder.Property(lh => lh.DeviceInfo).HasMaxLength(500);
        builder.Property(lh => lh.FailureReason).HasMaxLength(500);
        builder.HasIndex(lh => lh.UserId);
        builder.HasIndex(lh => lh.LoginAt);
    }
}
