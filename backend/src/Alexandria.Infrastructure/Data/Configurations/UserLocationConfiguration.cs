using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class UserLocationConfiguration : IEntityTypeConfiguration<UserLocation>
{
    public void Configure(EntityTypeBuilder<UserLocation> builder)
    {
        builder.ToTable("UserLocations");
        builder.HasKey(ul => ul.Id);
        builder.HasIndex(ul => ul.UserId);
        builder.HasIndex(ul => ul.Timestamp);
    }
}
