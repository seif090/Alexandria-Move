using QRCoder;

namespace Alexandria.Infrastructure.Services;

public class QrCodeService
{
    public byte[] GenerateQrCode(string data)
    {
        using var generator = new QRCodeGenerator();
        using var qrCodeData = generator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
        using var pngBytes = new PngByteQRCode(qrCodeData);
        return pngBytes.GetGraphic(20);
    }

    public string GenerateInvitationToken()
    {
        return Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32))
            .Replace("/", "_").Replace("+", "-")[..32];
    }
}
