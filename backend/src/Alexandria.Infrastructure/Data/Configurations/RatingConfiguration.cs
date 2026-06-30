using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class RatingConfiguration : IEntityTypeConfiguration<Rating>
{
    public void Configure(EntityTypeBuilder<Rating> builder)
    {
        builder.ToTable("Ratings");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.RatedEntityType).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.Property(r => r.ReviewText).HasMaxLength(1000);
        builder.HasIndex(r => r.RaterId);
        builder.HasIndex(r => new { r.RatedEntityId, r.RatedEntityType });
    }
}
