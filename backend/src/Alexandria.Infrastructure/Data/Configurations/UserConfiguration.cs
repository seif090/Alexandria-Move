using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.FullName).IsRequired().HasMaxLength(200);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(200);
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.PhoneNumber).HasMaxLength(20);
        builder.Property(u => u.PasswordHash).IsRequired();
        builder.Property(u => u.AuthenticationProvider).IsRequired().HasConversion<string>().HasMaxLength(20);
        builder.Property(u => u.GoogleId).HasMaxLength(200);
        builder.HasIndex(u => u.GoogleId).IsUnique().HasFilter("[GoogleId] IS NOT NULL");
        builder.Property(u => u.EmailVerified).IsRequired();
        builder.Property(u => u.ProfileImageUrl).HasMaxLength(500);
        builder.Property(u => u.Address).HasMaxLength(500);
        builder.Property(u => u.RefreshToken).HasMaxLength(500);
        builder.Property(u => u.Status).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.Property(u => u.Gender).HasConversion<string>().HasMaxLength(10);
        builder.HasMany(u => u.Roles).WithOne(ur => ur.User).HasForeignKey(ur => ur.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(u => u.Devices).WithOne(d => d.User).HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(u => u.LoginHistory).WithOne(l => l.User).HasForeignKey(l => l.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(u => u.Activities).WithOne(a => a.User).HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
