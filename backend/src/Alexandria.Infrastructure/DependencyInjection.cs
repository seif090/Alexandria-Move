using Alexandria.Application.Common.Interfaces;
using Alexandria.Infrastructure.Audit;
using Alexandria.Infrastructure.Data;
using Alexandria.Infrastructure.Files;
using Alexandria.Infrastructure.Identity;
using Alexandria.Infrastructure.Maps;
using Alexandria.Infrastructure.Notifications;
using Alexandria.Infrastructure.Payments;
using Alexandria.Infrastructure.BackgroundJobs;
using Alexandria.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Alexandria.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IDateTime, DateTimeService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IFileService, FileService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<ExcelService>();
        services.AddScoped<QrCodeService>();

        services.AddScoped<ILocationTrackingService, LocationTrackingService>();

        services.AddHttpClient<IOsrmService, OsrmService>(client =>
        {
            client.Timeout = TimeSpan.FromSeconds(15);
        });

        services.AddHttpClient<INominatimService, NominatimService>(client =>
        {
            client.Timeout = TimeSpan.FromSeconds(10);
            client.DefaultRequestHeaders.Add("User-Agent", "AlexandriaMobility/1.0");
        });

        services.AddScoped<IMapService, MapService>();

        services.AddScoped<TripReminderJob>();
        services.AddScoped<BookingExpirationJob>();

        return services;
    }
}
