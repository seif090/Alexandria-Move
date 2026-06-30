using FluentValidation;

namespace Alexandria.Application.Routes.Commands;

public class CreateRouteCommandValidator : AbstractValidator<CreateRouteCommand>
{
    public CreateRouteCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(200);
        RuleFor(v => v.StartLocation).NotEmpty().MaximumLength(200);
        RuleFor(v => v.EndLocation).NotEmpty().MaximumLength(200);
    }
}
