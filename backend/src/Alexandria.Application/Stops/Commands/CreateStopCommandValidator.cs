using FluentValidation;

namespace Alexandria.Application.Stops.Commands;

public class CreateStopCommandValidator : AbstractValidator<CreateStopCommand>
{
    public CreateStopCommandValidator()
    {
        RuleFor(v => v.RouteId).NotEmpty();
        RuleFor(v => v.Name).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Order).GreaterThanOrEqualTo(0);
    }
}
