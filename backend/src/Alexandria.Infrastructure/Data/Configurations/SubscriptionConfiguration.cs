using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.ToTable("Subscriptions");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.PlanName).IsRequired().HasMaxLength(100);
        builder.Property(s => s.Amount).HasColumnType("decimal(18,2)");
        builder.HasIndex(s => s.UserId);
        builder.HasIndex(s => s.CommunityId);
        builder.HasIndex(s => new { s.UserId, s.CommunityId });
    }
}
