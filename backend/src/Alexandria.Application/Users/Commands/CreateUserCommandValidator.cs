using FluentValidation;

namespace Alexandria.Application.Users.Commands;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(v => v.FullName).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Email).NotEmpty().EmailAddress().MaximumLength(200);
        RuleFor(v => v.Password).NotEmpty().MinimumLength(6).MaximumLength(100);
        RuleFor(v => v.PhoneNumber).MaximumLength(20);
    }
}
