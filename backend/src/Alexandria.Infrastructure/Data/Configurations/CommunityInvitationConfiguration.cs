using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class CommunityInvitationConfiguration : IEntityTypeConfiguration<CommunityInvitation>
{
    public void Configure(EntityTypeBuilder<CommunityInvitation> builder)
    {
        builder.ToTable("CommunityInvitations");
        builder.HasKey(ci => ci.Id);
        builder.Property(ci => ci.InvitedEmail).HasMaxLength(200);
        builder.Property(ci => ci.InvitedPhone).HasMaxLength(20);
        builder.Property(ci => ci.InvitationType).IsRequired().HasMaxLength(50);
        builder.Property(ci => ci.Token).IsRequired().HasMaxLength(500);
        builder.HasIndex(ci => ci.CommunityId);
        builder.HasIndex(ci => ci.Token).IsUnique();
        builder.HasIndex(ci => ci.InvitedEmail);
    }
}
