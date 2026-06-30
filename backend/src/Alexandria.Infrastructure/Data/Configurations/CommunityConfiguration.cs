using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class CommunityConfiguration : IEntityTypeConfiguration<Community>
{
    public void Configure(EntityTypeBuilder<Community> builder)
    {
        builder.ToTable("Communities");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Name).IsRequired().HasMaxLength(200);
        builder.Property(c => c.Description).HasMaxLength(1000);
        builder.Property(c => c.LogoUrl).HasMaxLength(500);
        builder.Property(c => c.CoverImageUrl).HasMaxLength(500);
        builder.Property(c => c.City).HasMaxLength(100);
        builder.Property(c => c.Area).HasMaxLength(100);
        builder.Property(c => c.Address).HasMaxLength(500);
        builder.Property(c => c.PhoneNumber).HasMaxLength(20);
        builder.Property(c => c.Email).HasMaxLength(200);
        builder.Property(c => c.Website).HasMaxLength(200);
        builder.Property(c => c.Type).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.HasIndex(c => c.Name);
        builder.HasIndex(c => c.City);
        builder.HasMany(c => c.Members).WithOne(m => m.Community).HasForeignKey(m => m.CommunityId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(c => c.Routes).WithOne(r => r.Community).HasForeignKey(r => r.CommunityId).OnDelete(DeleteBehavior.NoAction);
        builder.HasMany(c => c.Invitations).WithOne(i => i.Community).HasForeignKey(i => i.CommunityId).OnDelete(DeleteBehavior.Cascade);
    }
}
