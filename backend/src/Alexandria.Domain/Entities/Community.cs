using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class Community : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public CommunityType Type { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? City { get; set; }
    public string? Area { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public bool IsApproved { get; set; }
    public bool IsActive { get; set; }
    public int? MaxMembers { get; set; }
    public Guid CreatedById { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public virtual ICollection<CommunityMember> Members { get; set; } = new HashSet<CommunityMember>();
    public virtual ICollection<Route> Routes { get; set; } = new HashSet<Route>();
    public virtual ICollection<TransportationGroup> Groups { get; set; } = new HashSet<TransportationGroup>();
    public virtual ICollection<CommunityInvitation> Invitations { get; set; } = new HashSet<CommunityInvitation>();
}
