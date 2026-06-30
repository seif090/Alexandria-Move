using Alexandria.Application.Common.Models;
using Alexandria.Application.Drivers.DTOs;
using MediatR;

namespace Alexandria.Application.Drivers.Commands;

public class UpdateDriverCommand : IRequest<Result<DriverDto>>
{
    public Guid Id { get; set; }
    public string? LicenseNumber { get; set; }
    public DateTime? LicenseExpiryDate { get; set; }
}
