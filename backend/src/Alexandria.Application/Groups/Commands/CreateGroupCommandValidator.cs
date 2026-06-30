using FluentValidation;

namespace Alexandria.Application.Groups.Commands;

public class CreateGroupCommandValidator : AbstractValidator<CreateGroupCommand>
{
    public CreateGroupCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Type).NotEmpty();
        RuleFor(v => v.Capacity).GreaterThan(0);
    }
}
