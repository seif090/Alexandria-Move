using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;

namespace Alexandria.Application.Drivers.DTOs;

public class DriverDto : IMapFrom<Driver>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string? LicenseNumber { get; set; }
    public DateTime? LicenseExpiryDate { get; set; }
    public DriverStatus Status { get; set; }
    public bool IsVerified { get; set; }
    public double? Rating { get; set; }
    public int TotalTrips { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateDriverDto
{
    public Guid UserId { get; set; }
    public string? LicenseNumber { get; set; }
    public DateTime? LicenseExpiryDate { get; set; }
}

public class UpdateDriverDto
{
    public string? LicenseNumber { get; set; }
    public DateTime? LicenseExpiryDate { get; set; }
}

public class DriverScoreDto
{
    public Guid DriverId { get; set; }
    public double OverallScore { get; set; }
    public double RatingScore { get; set; }
    public double ReliabilityScore { get; set; }
    public int CompletedTrips { get; set; }
    public int CancelledTrips { get; set; }
}
