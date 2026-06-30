using Alexandria.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.API.Controllers;

[Authorize]
public class SettingsController : BaseApiController
{
    private readonly IApplicationDbContext _context;

    public SettingsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _context.Settings
            .Where(s => !s.IsDeleted)
            .Select(s => new { s.Key, s.Value, s.Group, s.Description })
            .ToListAsync();
        return Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateSettingsRequest request)
    {
        var existing = await _context.Settings
            .Where(s => !s.IsDeleted)
            .ToListAsync();

        foreach (var item in request.Settings)
        {
            var setting = existing.FirstOrDefault(s => s.Key == item.Key);
            if (setting != null)
            {
                setting.Value = item.Value;
            }
            else
            {
                _context.Settings.Add(new Domain.Entities.Setting
                {
                    Key = item.Key,
                    Value = item.Value,
                    Group = "General",
                    IsSystem = false
                });
            }
        }

        await _context.SaveChangesAsync(default);
        return Ok(new { message = "Settings saved successfully" });
    }

    [HttpPost("reset")]
    public async Task<IActionResult> ResetSettings()
    {
        var nonSystem = await _context.Settings
            .Where(s => !s.IsSystem && !s.IsDeleted)
            .ToListAsync();

        foreach (var s in nonSystem)
        {
            s.IsDeleted = true;
            s.DeletedBy = HttpContext.Items["UserId"]?.ToString();
            s.DeletedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(default);
        return Ok(new { message = "Settings reset successfully" });
    }

    [HttpPost("seed")]
    public async Task<IActionResult> SeedDefaultSettings()
    {
        var defaults = new List<(string key, string value, string group, string? desc)>
        {
            ("PlatformName", "Alexandria Move", "General", "Platform display name"),
            ("SupportEmail", "support@alexandria.com", "General", "Support email address"),
            ("SupportPhone", "+201234567890", "General", "Support phone number"),
            ("DefaultCurrency", "USD", "General", "Default currency for pricing"),
            ("TimeZone", "UTC", "General", "System time zone"),
            ("DateFormat", "MM/DD/YYYY", "General", "Date display format"),
            ("PasswordMinLength", "8", "Security", "Minimum password length"),
            ("MaxLoginAttempts", "5", "Security", "Maximum failed login attempts"),
            ("SessionTimeoutMinutes", "60", "Security", "Session timeout duration"),
            ("RequireEmailVerification", "true", "Security", "Require email verification"),
            ("EnableTwoFactor", "false", "Security", "Enable two-factor authentication"),
            ("JwtExpiryHours", "24", "Security", "JWT token expiry hours"),
            ("MaxBookingAdvanceDays", "30", "Operations", "Max days ahead for booking"),
            ("CancellationFeePercent", "10", "Operations", "Cancellation fee percentage"),
            ("DriverCommissionPercent", "15", "Operations", "Driver commission percentage"),
            ("MaxPassengersPerBooking", "5", "Operations", "Max passengers per booking"),
            ("EnablePublicRegistration", "true", "Operations", "Allow public user registration"),
            ("AutoApproveCommunities", "false", "Operations", "Auto-approve new communities"),
        };

        foreach (var (key, value, group, desc) in defaults)
        {
            var exists = await _context.Settings.AnyAsync(s => s.Key == key && !s.IsDeleted);
            if (!exists)
            {
                _context.Settings.Add(new Domain.Entities.Setting
                {
                    Key = key,
                    Value = value,
                    Group = group,
                    Description = desc,
                    IsSystem = true
                });
            }
        }

        await _context.SaveChangesAsync(default);
        return Ok(new { message = "Default settings seeded" });
    }
}

public record UpdateSettingsRequest(List<SettingItem> Settings);
public record SettingItem(string Key, string Value);
