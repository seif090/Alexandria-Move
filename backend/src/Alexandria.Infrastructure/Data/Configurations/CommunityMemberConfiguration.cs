using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class CommunityMemberConfiguration : IEntityTypeConfiguration<CommunityMember>
{
    public void Configure(EntityTypeBuilder<CommunityMember> builder)
    {
        builder.ToTable("CommunityMembers");
        builder.HasKey(cm => cm.Id);
        builder.Property(cm => cm.Status).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.Property(cm => cm.Role).HasMaxLength(100);
        builder.Property(cm => cm.Notes).HasMaxLength(500);
        builder.HasIndex(cm => cm.CommunityId);
        builder.HasIndex(cm => cm.UserId);
        builder.HasIndex(cm => new { cm.CommunityId, cm.UserId }).IsUnique();
    }
}
