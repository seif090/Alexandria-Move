using FluentValidation;

namespace Alexandria.Application.Roles.Commands;

public class CreateRoleCommandValidator : AbstractValidator<CreateRoleCommand>
{
    public CreateRoleCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(100);
    }
}
