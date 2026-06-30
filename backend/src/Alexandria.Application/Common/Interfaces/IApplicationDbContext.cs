using Alexandria.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<RolePermission> RolePermissions { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<UserDevice> UserDevices { get; }
    DbSet<LoginHistory> LoginHistories { get; }
    DbSet<UserActivity> UserActivities { get; }
    DbSet<Community> Communities { get; }
    DbSet<CommunityMember> CommunityMembers { get; }
    DbSet<CommunityInvitation> CommunityInvitations { get; }
    DbSet<Route> Routes { get; }
    DbSet<Stop> Stops { get; }
    DbSet<TransportationGroup> TransportationGroups { get; }
    DbSet<Driver> Drivers { get; }
    DbSet<DriverDocument> DriverDocuments { get; }
    DbSet<Vehicle> Vehicles { get; }
    DbSet<VehicleDocument> VehicleDocuments { get; }
    DbSet<MaintenanceRecord> MaintenanceRecords { get; }
    DbSet<Booking> Bookings { get; }
    DbSet<Trip> Trips { get; }
    DbSet<TripPassenger> TripPassengers { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Subscription> Subscriptions { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<Rating> Ratings { get; }
    DbSet<SupportTicket> SupportTickets { get; }
    DbSet<SupportMessage> SupportMessages { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<FileUpload> FileUploads { get; }
    DbSet<UserLocation> UserLocations { get; }
    DbSet<Setting> Settings { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
