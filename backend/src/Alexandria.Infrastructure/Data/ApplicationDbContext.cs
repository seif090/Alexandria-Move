using System.Reflection;
using Alexandria.Application.Common.Interfaces;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    private readonly IDateTime _dateTime;
    private readonly ICurrentUserService _currentUser;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IDateTime dateTime, ICurrentUserService currentUser)
        : base(options)
    {
        _dateTime = dateTime;
        _currentUser = currentUser;
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<UserDevice> UserDevices => Set<UserDevice>();
    public DbSet<LoginHistory> LoginHistories => Set<LoginHistory>();
    public DbSet<UserActivity> UserActivities => Set<UserActivity>();
    public DbSet<Community> Communities => Set<Community>();
    public DbSet<CommunityMember> CommunityMembers => Set<CommunityMember>();
    public DbSet<CommunityInvitation> CommunityInvitations => Set<CommunityInvitation>();
    public DbSet<Route> Routes => Set<Route>();
    public DbSet<Stop> Stops => Set<Stop>();
    public DbSet<TransportationGroup> TransportationGroups => Set<TransportationGroup>();
    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<DriverDocument> DriverDocuments => Set<DriverDocument>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<VehicleDocument> VehicleDocuments => Set<VehicleDocument>();
    public DbSet<MaintenanceRecord> MaintenanceRecords => Set<MaintenanceRecord>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<TripPassenger> TripPassengers => Set<TripPassenger>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Rating> Ratings => Set<Rating>();
    public DbSet<SupportTicket> SupportTickets => Set<SupportTicket>();
    public DbSet<SupportMessage> SupportMessages => Set<SupportMessage>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<FileUpload> FileUploads => Set<FileUpload>();
    public DbSet<UserLocation> UserLocations => Set<UserLocation>();
    public DbSet<Setting> Settings => Set<Setting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                var method = typeof(ApplicationDbContext).GetMethod(nameof(SetSoftDeleteFilter), BindingFlags.NonPublic | BindingFlags.Static)!
                    .MakeGenericMethod(entityType.ClrType);
                method.Invoke(null, new object[] { modelBuilder });
            }
        }

        SeedData(modelBuilder);
    }

    private static void SetSoftDeleteFilter<T>(ModelBuilder modelBuilder) where T : BaseEntity
    {
        modelBuilder.Entity<T>().HasQueryFilter(e => !e.IsDeleted);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var superAdminRoleId = Guid.Parse("A1B2C3D4-E5F6-7890-ABCD-EF1234567890");
        var adminRoleId = Guid.Parse("B2C3D4E5-F6A7-8901-BCDE-F12345678901");
        var passengerRoleId = Guid.Parse("C3D4E5F6-A7B8-9012-CDEF-123456789012");
        var driverRoleId = Guid.Parse("D4E5F6A7-B8C9-0123-DEF1-234567890123");
        var companyAdminRoleId = Guid.Parse("E5F6A7B8-C9D0-1234-EF12-345678901234");
        var schoolAdminRoleId = Guid.Parse("F6A7B8C9-D0E1-2345-F123-456789012345");

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = superAdminRoleId, Name = "SuperAdmin", Description = "Full system access", IsSystemRole = true, CreatedAt = DateTime.UtcNow },
            new Role { Id = adminRoleId, Name = "CommunityAdmin", Description = "Community administration", IsSystemRole = true, CreatedAt = DateTime.UtcNow },
            new Role { Id = passengerRoleId, Name = "Passenger", Description = "Regular passenger", IsSystemRole = true, CreatedAt = DateTime.UtcNow },
            new Role { Id = driverRoleId, Name = "Driver", Description = "Vehicle driver", IsSystemRole = true, CreatedAt = DateTime.UtcNow },
            new Role { Id = companyAdminRoleId, Name = "CompanyAdmin", Description = "Company administrator", IsSystemRole = true, CreatedAt = DateTime.UtcNow },
            new Role { Id = schoolAdminRoleId, Name = "SchoolAdmin", Description = "School administrator", IsSystemRole = true, CreatedAt = DateTime.UtcNow }
        );

        var adminUserId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = adminUserId,
            FullName = "Super Admin",
            Email = "admin@alexandria.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            PhoneNumber = "+201234567890",
            Status = Domain.Enums.UserStatus.Active,
            IsVerified = true,
            AuthenticationProvider = AuthenticationProvider.Local,
            EmailVerified = true,
            RegistrationDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        });

        modelBuilder.Entity<UserRole>().HasData(new UserRole
        {
            UserId = adminUserId,
            RoleId = superAdminRoleId,
            AssignedAt = DateTime.UtcNow
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = _dateTime.UtcNow;
                    entry.Entity.CreatedBy = _currentUser.UserId;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = _dateTime.UtcNow;
                    entry.Entity.UpdatedBy = _currentUser.UserId;
                    break;
                case EntityState.Deleted:
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedAt = _dateTime.UtcNow;
                    entry.Entity.DeletedBy = _currentUser.UserId;
                    entry.State = EntityState.Modified;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
