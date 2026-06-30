using Alexandria.Application.Common.Interfaces;
using Alexandria.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

public class AuthController : BaseApiController
{
    private readonly IIdentityService _identityService;
    private readonly ICurrentUserService _currentUser;
    private readonly IApplicationDbContext _context;

    public AuthController(IIdentityService identityService, ICurrentUserService currentUser, IApplicationDbContext context)
    {
        _identityService = identityService;
        _currentUser = currentUser;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var (success, token, refreshToken) = await _identityService.LoginAsync(request.Email, request.Password, _currentUser.IpAddress ?? "0.0.0.0");
        if (!success) return Unauthorized(new { message = "Invalid credentials" });
        return Ok(new { token, refreshToken });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var (success, message) = await _identityService.RegisterAsync(request.FullName, request.Email, request.Password, request.PhoneNumber ?? string.Empty);
        if (!success) return BadRequest(new { message });
        return Ok(new { message });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var (success, token, refreshToken) = await _identityService.RefreshTokenAsync(request.Token, request.RefreshToken);
        if (!success) return Unauthorized(new { message = "Invalid refresh token" });
        return Ok(new { token, refreshToken });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _identityService.LogoutAsync(_currentUser.UserId!, string.Empty);
        return Ok(new { message = "Logged out successfully" });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var result = await _identityService.ChangePasswordAsync(_currentUser.UserId!, request.CurrentPassword, request.NewPassword);
        if (!result) return BadRequest(new { message = "Current password is incorrect" });
        return Ok(new { message = "Password changed successfully" });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await _identityService.GetUserByIdAsync(_currentUser.UserId!);
        if (user == null) return NotFound(new { message = "User not found" });
        return Ok(new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email,
            phoneNumber = user.PhoneNumber,
            profileImageUrl = user.ProfileImageUrl,
            dateOfBirth = user.DateOfBirth,
            gender = user.Gender?.ToString(),
            address = user.Address,
            status = user.Status.ToString(),
            registrationDate = user.RegistrationDate,
            lastLogin = user.LastLogin,
            isVerified = user.IsVerified,
            twoFactorEnabled = user.TwoFactorEnabled,
            roles = user.Roles.Select(ur => ur.Role.Name).ToList()
        });
    }

    [Authorize]
    [HttpPost("update-profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var user = await _identityService.GetUserByIdAsync(_currentUser.UserId!);
        if (user == null) return NotFound(new { message = "User not found" });

        user.FullName = request.FullName ?? user.FullName;
        user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
        user.Address = request.Address ?? user.Address;
        if (request.DateOfBirth.HasValue) user.DateOfBirth = request.DateOfBirth;
        if (!string.IsNullOrEmpty(request.Gender) && Enum.TryParse<Gender>(request.Gender, true, out var gender))
            user.Gender = gender;

        await _context.SaveChangesAsync(default);
        return Ok(new { message = "Profile updated successfully" });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var token = await _identityService.GeneratePasswordResetTokenAsync(request.Email);
        return Ok(new { message = "Password reset email sent", token });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await _identityService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
        if (!result) return BadRequest(new { message = "Invalid reset request" });
        return Ok(new { message = "Password reset successfully" });
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        var (success, token, refreshToken, isNewUser) = await _identityService.GoogleLoginAsync(request.IdToken, _currentUser.IpAddress ?? "0.0.0.0");
        if (!success) return Unauthorized(new { message = "Invalid Google token" });
        return Ok(new { token, refreshToken, isNewUser });
    }

    [HttpPost("verify-reset-code")]
    public async Task<IActionResult> VerifyResetCode([FromBody] VerifyResetCodeRequest request)
    {
        var isValid = await _identityService.VerifyPasswordResetTokenAsync(request.Email, request.Code);
        if (!isValid) return BadRequest(new { message = "Invalid or expired code" });
        return Ok(new { message = "Code verified" });
    }

    [HttpPost("driver-register")]
    public async Task<IActionResult> DriverRegister([FromBody] DriverRegisterRequest request)
    {
        var (success, message) = await _identityService.RegisterDriverAsync(
            request.FullName, request.Email, request.Password, request.PhoneNumber ?? string.Empty,
            request.LicenseNumber, request.YearsOfExperience,
            request.VehicleBrand, request.VehicleModel, request.VehicleYear,
            request.VehiclePlate, request.VehicleColor, request.VehicleCapacity);
        if (!success) return BadRequest(new { message });
        return Ok(new { message });
    }
}

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string FullName, string Email, string Password, string? PhoneNumber);
public record RefreshTokenRequest(string Token, string RefreshToken);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Email, string Token, string NewPassword);
public record UpdateProfileRequest(string? FullName, string? PhoneNumber, string? Address, DateTime? DateOfBirth, string? Gender);
public record GoogleLoginRequest(string IdToken);
public record VerifyResetCodeRequest(string Email, string Code);
public record DriverRegisterRequest(string FullName, string Email, string Password, string? PhoneNumber, string LicenseNumber, int YearsOfExperience, string VehicleBrand, string VehicleModel, int VehicleYear, string VehiclePlate, string VehicleColor, int VehicleCapacity);
