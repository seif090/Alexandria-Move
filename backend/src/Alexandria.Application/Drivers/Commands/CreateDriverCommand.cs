using Alexandria.Application.Common.Models;
using Alexandria.Application.Drivers.DTOs;
using MediatR;

namespace Alexandria.Application.Drivers.Commands;

public class CreateDriverCommand : IRequest<Result<DriverDto>>
{
    public Guid UserId { get; set; }
    public string? LicenseNumber { get; set; }
    public DateTime? LicenseExpiryDate { get; set; }
}
