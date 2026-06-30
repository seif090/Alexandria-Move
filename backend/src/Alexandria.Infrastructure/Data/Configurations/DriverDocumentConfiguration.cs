using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class DriverDocumentConfiguration : IEntityTypeConfiguration<DriverDocument>
{
    public void Configure(EntityTypeBuilder<DriverDocument> builder)
    {
        builder.ToTable("DriverDocuments");
        builder.HasKey(dd => dd.Id);
        builder.Property(dd => dd.DocumentType).IsRequired().HasMaxLength(100);
        builder.Property(dd => dd.DocumentUrl).IsRequired().HasMaxLength(500);
        builder.HasIndex(dd => dd.DriverId);
    }
}
