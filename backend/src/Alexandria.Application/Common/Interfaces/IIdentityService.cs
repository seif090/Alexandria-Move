using Alexandria.Domain.Entities;

namespace Alexandria.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<(bool Success, string Token, string RefreshToken)> LoginAsync(string email, string password, string ipAddress);
    Task<(bool Success, string Message)> RegisterAsync(string fullName, string email, string password, string phoneNumber);
    Task<(bool Success, string Token, string RefreshToken)> RefreshTokenAsync(string token, string refreshToken);
    Task<bool> LogoutAsync(string userId, string refreshToken);
    Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword);
    Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
    Task<string> GeneratePasswordResetTokenAsync(string email);
    Task<bool> VerifyEmailAsync(string userId, string token);
    Task<bool> EnableTwoFactorAsync(string userId);
    Task<bool> DisableTwoFactorAsync(string userId);
    Task<bool> ValidateTwoFactorCodeAsync(string userId, string code);
    Task<User?> GetUserByIdAsync(string userId);
    Task<User?> GetUserByEmailAsync(string email);
    Task<(bool Success, string Token, string RefreshToken, bool IsNewUser)> GoogleLoginAsync(string idToken, string ipAddress);
    Task<bool> VerifyPasswordResetTokenAsync(string email, string code);
    Task<(bool Success, string Message)> RegisterDriverAsync(string fullName, string email, string password, string phoneNumber, string licenseNumber, int yearsOfExperience, string vehicleBrand, string vehicleModel, int vehicleYear, string vehiclePlate, string vehicleColor, int vehicleCapacity);
}
