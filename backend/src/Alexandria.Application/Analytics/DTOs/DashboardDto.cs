namespace Alexandria.Application.Analytics.DTOs;

public class SuperAdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int ActiveCommunities { get; set; }
    public int TotalTrips { get; set; }
    public decimal TotalRevenue { get; set; }
    public int NewUsersThisMonth { get; set; }
    public int TripsThisMonth { get; set; }
    public decimal RevenueThisMonth { get; set; }
    public List<PopularRouteDto> PopularRoutes { get; set; } = new();
    public List<RecentUserDto> RecentUsers { get; set; } = new();
}

public class CommunityDashboardDto
{
    public string CommunityName { get; set; } = string.Empty;
    public int TotalMembers { get; set; }
    public int ActiveMembers { get; set; }
    public int TotalRoutes { get; set; }
    public int TotalGroups { get; set; }
    public int TotalTrips { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class DriverDashboardDto
{
    public string DriverName { get; set; } = string.Empty;
    public int TotalTrips { get; set; }
    public int CompletedTrips { get; set; }
    public int CancelledTrips { get; set; }
    public double AverageRating { get; set; }
    public decimal TotalEarnings { get; set; }
}

public class PopularRouteDto
{
    public string RouteName { get; set; } = string.Empty;
    public int BookingCount { get; set; }
}

public class RecentUserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
}
