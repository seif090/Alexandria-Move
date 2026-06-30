using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Alexandria.Infrastructure.Data.Configurations;

public class SupportTicketConfiguration : IEntityTypeConfiguration<SupportTicket>
{
    public void Configure(EntityTypeBuilder<SupportTicket> builder)
    {
        builder.ToTable("SupportTickets");
        builder.HasKey(st => st.Id);
        builder.Property(st => st.Subject).IsRequired().HasMaxLength(200);
        builder.Property(st => st.Description).HasMaxLength(2000);
        builder.Property(st => st.Status).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.Property(st => st.Priority).IsRequired().HasConversion<string>().HasMaxLength(30);
        builder.HasOne(st => st.User).WithMany().HasForeignKey(st => st.UserId).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(st => st.AssignedTo).WithMany().HasForeignKey(st => st.AssignedToId).OnDelete(DeleteBehavior.NoAction);
        builder.HasIndex(st => st.Status);
        builder.HasMany(st => st.Messages).WithOne(m => m.Ticket).HasForeignKey(m => m.TicketId).OnDelete(DeleteBehavior.Cascade);
    }
}
