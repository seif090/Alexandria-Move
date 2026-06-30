using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class UserDeviceConfiguration : IEntityTypeConfiguration<UserDevice>
{
    public void Configure(EntityTypeBuilder<UserDevice> builder)
    {
        builder.ToTable("UserDevices");
        builder.HasKey(ud => ud.Id);
        builder.Property(ud => ud.DeviceName).IsRequired().HasMaxLength(200);
        builder.Property(ud => ud.DeviceType).IsRequired().HasMaxLength(50);
        builder.Property(ud => ud.DeviceToken).IsRequired().HasMaxLength(500);
        builder.HasIndex(ud => ud.UserId);
        builder.HasIndex(ud => ud.DeviceToken);
    }
}
