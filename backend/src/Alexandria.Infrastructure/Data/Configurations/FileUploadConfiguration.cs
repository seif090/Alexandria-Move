using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class FileUploadConfiguration : IEntityTypeConfiguration<FileUpload>
{
    public void Configure(EntityTypeBuilder<FileUpload> builder)
    {
        builder.ToTable("FileUploads");
        builder.HasKey(fu => fu.Id);
        builder.Property(fu => fu.FileName).IsRequired().HasMaxLength(500);
        builder.Property(fu => fu.OriginalName).IsRequired().HasMaxLength(500);
        builder.Property(fu => fu.ContentType).IsRequired().HasMaxLength(100);
        builder.Property(fu => fu.Path).IsRequired().HasMaxLength(1000);
        builder.Property(fu => fu.ContainerName).HasMaxLength(100);
        builder.Property(fu => fu.EntityType).HasMaxLength(100);
        builder.Property(fu => fu.EntityId).HasMaxLength(100);
        builder.HasIndex(fu => fu.UploadedById);
    }
}
