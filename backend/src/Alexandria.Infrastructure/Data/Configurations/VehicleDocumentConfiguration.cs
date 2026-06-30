using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class VehicleDocumentConfiguration : IEntityTypeConfiguration<VehicleDocument>
{
    public void Configure(EntityTypeBuilder<VehicleDocument> builder)
    {
        builder.ToTable("VehicleDocuments");
        builder.HasKey(vd => vd.Id);
        builder.Property(vd => vd.DocumentType).IsRequired().HasMaxLength(100);
        builder.Property(vd => vd.DocumentUrl).IsRequired().HasMaxLength(500);
        builder.HasIndex(vd => vd.VehicleId);
    }
}
