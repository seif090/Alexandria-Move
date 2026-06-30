using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Alexandria.Application.Common.Interfaces;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Alexandria.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private static readonly ConcurrentDictionary<string, (string Code, DateTime Expiry)> _resetCodes = new();

    private readonly IApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IDateTime _dateTime;
    private readonly IAuditService _auditService;

    public IdentityService(IApplicationDbContext context, IConfiguration configuration, IDateTime dateTime, IAuditService auditService)
    {
        _context = context;
        _configuration = configuration;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<(bool Success, string Token, string RefreshToken)> LoginAsync(string email, string password, string ipAddress)
    {
        var user = await _context.Users.Include(u => u.Roles).ThenInclude(ur => ur.Role).FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            await _auditService.LogLoginAsync(string.Empty, ipAddress, false, "User not found");
            return (false, string.Empty, string.Empty);
        }

        if (user.LockoutEnd > _dateTime.UtcNow)
        {
            await _auditService.LogLoginAsync(user.Id.ToString(), ipAddress, false, "Account locked");
            return (false, string.Empty, string.Empty);
        }

        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            user.AccessFailedCount++;
            if (user.AccessFailedCount >= 5)
                user.LockoutEnd = _dateTime.UtcNow.AddMinutes(15);
            await _context.SaveChangesAsync(default);
            await _auditService.LogLoginAsync(user.Id.ToString(), ipAddress, false, "Invalid password");
            return (false, string.Empty, string.Empty);
        }

        if (user.Status != UserStatus.Active)
        {
            await _auditService.LogLoginAsync(user.Id.ToString(), ipAddress, false, "Account inactive");
            return (false, string.Empty, string.Empty);
        }

        user.AccessFailedCount = 0;
        user.LastLogin = _dateTime.UtcNow;
        var token = await GenerateJwtTokenAsync(user);
        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = _dateTime.UtcNow.AddDays(7);

        _context.LoginHistories.Add(new LoginHistory
        {
            UserId = user.Id,
            IpAddress = ipAddress,
            LoginAt = _dateTime.UtcNow,
            IsSuccessful = true
        });

        await _context.SaveChangesAsync(default);
        await _auditService.LogLoginAsync(user.Id.ToString(), ipAddress, true);

        return (true, token, refreshToken);
    }

    public async Task<(bool Success, string Message)> RegisterAsync(string fullName, string email, string password, string phoneNumber)
    {
        if (await _context.Users.AnyAsync(u => u.Email == email))
            return (false, "Email already registered");

        var user = new User
        {
            FullName = fullName,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            PhoneNumber = phoneNumber,
            AuthenticationProvider = AuthenticationProvider.Local,
            Status = UserStatus.PendingVerification,
            RegistrationDate = _dateTime.UtcNow,
            CreatedAt = _dateTime.UtcNow
        };

        _context.Users.Add(user);

        var passengerRole = await _context.Roles.FirstAsync(r => r.Name == "Passenger");
        _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = passengerRole.Id, AssignedAt = _dateTime.UtcNow });

        await _context.SaveChangesAsync(default);
        return (true, "Registration successful");
    }

    public async Task<(bool Success, string Token, string RefreshToken)> RefreshTokenAsync(string token, string refreshToken)
    {
        var principal = GetPrincipalFromExpiredToken(token);
        if (principal == null) return (false, string.Empty, string.Empty);

        var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return (false, string.Empty, string.Empty);

        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= _dateTime.UtcNow)
            return (false, string.Empty, string.Empty);

        var newToken = await GenerateJwtTokenAsync(user);
        var newRefreshToken = GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = _dateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync(default);

        return (true, newToken, newRefreshToken);
    }

    public async Task<bool> LogoutAsync(string userId, string refreshToken)
    {
        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null) return false;
        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await _context.SaveChangesAsync(default);
        return true;
    }

    public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
    {
        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null || !BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            return false;
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _context.SaveChangesAsync(default);
        return true;
    }

    public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null) return false;

        if (!_resetCodes.TryGetValue(email, out var stored) || stored.Code != token || stored.Expiry < _dateTime.UtcNow)
            return false;

        _resetCodes.TryRemove(email, out _);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _context.SaveChangesAsync(default);
        return true;
    }

    public Task<string> GeneratePasswordResetTokenAsync(string email)
    {
        var code = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
        _resetCodes[email] = (code, _dateTime.UtcNow.AddMinutes(15));
        return Task.FromResult(code);
    }

    public Task<bool> VerifyPasswordResetTokenAsync(string email, string code)
    {
        if (!_resetCodes.TryGetValue(email, out var stored))
            return Task.FromResult(false);
        if (stored.Expiry < _dateTime.UtcNow)
        {
            _resetCodes.TryRemove(email, out _);
            return Task.FromResult(false);
        }
        return Task.FromResult(stored.Code == code);
    }

    public async Task<(bool Success, string Message)> RegisterDriverAsync(string fullName, string email, string password, string phoneNumber, string licenseNumber, int yearsOfExperience, string vehicleBrand, string vehicleModel, int vehicleYear, string vehiclePlate, string vehicleColor, int vehicleCapacity)
    {
        if (await _context.Users.AnyAsync(u => u.Email == email))
            return (false, "Email already registered");

        var user = new User
        {
            FullName = fullName,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            PhoneNumber = phoneNumber,
            AuthenticationProvider = AuthenticationProvider.Local,
            Status = UserStatus.PendingVerification,
            RegistrationDate = _dateTime.UtcNow,
            CreatedAt = _dateTime.UtcNow
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync(default);

        var driverRole = await _context.Roles.FirstAsync(r => r.Name == "Driver");
        _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = driverRole.Id, AssignedAt = _dateTime.UtcNow });
        await _context.SaveChangesAsync(default);

        var driver = new Driver
        {
            UserId = user.Id,
            LicenseNumber = licenseNumber,
            YearsOfExperience = yearsOfExperience,
            Status = DriverStatus.Pending,
            CreatedAt = _dateTime.UtcNow
        };
        _context.Drivers.Add(driver);
        await _context.SaveChangesAsync(default);

        var vehicle = new Vehicle
        {
            DriverId = driver.Id,
            OwnerId = user.Id,
            Brand = vehicleBrand,
            Model = vehicleModel,
            Year = vehicleYear,
            PlateNumber = vehiclePlate,
            Color = vehicleColor,
            Capacity = vehicleCapacity,
            Type = VehicleType.Sedan,
            Status = VehicleStatus.Active,
            CreatedAt = _dateTime.UtcNow
        };
        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync(default);

        return (true, "Driver registration successful");
    }

    public async Task<bool> VerifyEmailAsync(string userId, string token)
    {
        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null) return false;
        user.IsVerified = true;
        user.Status = UserStatus.Active;
        await _context.SaveChangesAsync(default);
        return true;
    }

    public async Task<bool> EnableTwoFactorAsync(string userId)
    {
        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null) return false;
        user.TwoFactorEnabled = true;
        await _context.SaveChangesAsync(default);
        return true;
    }

    public async Task<bool> DisableTwoFactorAsync(string userId)
    {
        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null) return false;
        user.TwoFactorEnabled = false;
        await _context.SaveChangesAsync(default);
        return true;
    }

    public Task<bool> ValidateTwoFactorCodeAsync(string userId, string code)
    {
        return Task.FromResult(true);
    }

    public async Task<User?> GetUserByIdAsync(string userId)
    {
        return await _context.Users.Include(u => u.Roles).ThenInclude(ur => ur.Role).FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.Include(u => u.Roles).ThenInclude(ur => ur.Role).FirstOrDefaultAsync(u => u.Email == email);
    }

    private async Task<string> GenerateJwtTokenAsync(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new("phoneNumber", user.PhoneNumber ?? string.Empty)
        };

        foreach (var role in user.Roles.Select(ur => ur.Role.Name))
            claims.Add(new Claim(ClaimTypes.Role, role));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: _dateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<(bool Success, string Token, string RefreshToken, bool IsNewUser)> GoogleLoginAsync(string idToken, string ipAddress)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _configuration["Google:ClientId"] }
            };
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            var user = await _context.Users
                .Include(u => u.Roles).ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);

            bool isNewUser = false;

            if (user == null)
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);
                if (user != null)
                {
                    user.GoogleId = payload.Subject;
                    user.AuthenticationProvider = AuthenticationProvider.Google;
                    user.EmailVerified = payload.EmailVerified;
                    user.ProfileImageUrl ??= payload.Picture;
                }
            }

            if (user == null)
            {
                isNewUser = true;
                user = new User
                {
                    FullName = payload.Name,
                    Email = payload.Email,
                    GoogleId = payload.Subject,
                    AuthenticationProvider = AuthenticationProvider.Google,
                    ProfileImageUrl = payload.Picture,
                    EmailVerified = payload.EmailVerified,
                    Status = UserStatus.Active,
                    IsVerified = payload.EmailVerified,
                    RegistrationDate = _dateTime.UtcNow,
                    CreatedAt = _dateTime.UtcNow
                };
                _context.Users.Add(user);

                var passengerRole = await _context.Roles.FirstAsync(r => r.Name == "Passenger");
                _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = passengerRole.Id, AssignedAt = _dateTime.UtcNow });
            }

            user.LastLogin = _dateTime.UtcNow;
            user.AccessFailedCount = 0;
            var token = await GenerateJwtTokenAsync(user);
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = _dateTime.UtcNow.AddDays(7);

            _context.LoginHistories.Add(new LoginHistory
            {
                UserId = user.Id,
                IpAddress = ipAddress,
                LoginAt = _dateTime.UtcNow,
                IsSuccessful = true
            });

            await _context.SaveChangesAsync(default);
            await _auditService.LogLoginAsync(user.Id.ToString(), ipAddress, true);

            return (true, token, refreshToken, isNewUser);
        }
        catch (InvalidJwtException)
        {
            return (false, string.Empty, string.Empty, false);
        }
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = false,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidAudience = _configuration["Jwt:Audience"],
            IssuerSigningKey = key
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        if (securityToken is not JwtSecurityToken jwtToken || !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            return null;

        return principal;
    }
}
