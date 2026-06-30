using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class SupportMessageConfiguration : IEntityTypeConfiguration<SupportMessage>
{
    public void Configure(EntityTypeBuilder<SupportMessage> builder)
    {
        builder.ToTable("SupportMessages");
        builder.HasKey(sm => sm.Id);
        builder.Property(sm => sm.Message).IsRequired().HasMaxLength(2000);
        builder.HasIndex(sm => sm.TicketId);
        builder.HasOne(sm => sm.Sender).WithMany().HasForeignKey(sm => sm.SenderId).OnDelete(DeleteBehavior.NoAction);
    }
}
