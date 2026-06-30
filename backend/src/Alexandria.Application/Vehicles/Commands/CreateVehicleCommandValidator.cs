using FluentValidation;

namespace Alexandria.Application.Vehicles.Commands;

public class CreateVehicleCommandValidator : AbstractValidator<CreateVehicleCommand>
{
    public CreateVehicleCommandValidator()
    {
        RuleFor(v => v.DriverId).NotEmpty();
        RuleFor(v => v.PlateNumber).NotEmpty().MaximumLength(20);
        RuleFor(v => v.Model).NotEmpty().MaximumLength(100);
        RuleFor(v => v.Color).NotEmpty().MaximumLength(50);
        RuleFor(v => v.Year).GreaterThan(1900).LessThanOrEqualTo(DateTime.UtcNow.Year + 1);
        RuleFor(v => v.Capacity).GreaterThan(0);
        RuleFor(v => v.Type).NotEmpty();
    }
}
