using FluentValidation;

namespace Alexandria.Application.Drivers.Commands;

public class CreateDriverCommandValidator : AbstractValidator<CreateDriverCommand>
{
    public CreateDriverCommandValidator()
    {
        RuleFor(v => v.UserId).NotEmpty();
    }
}
