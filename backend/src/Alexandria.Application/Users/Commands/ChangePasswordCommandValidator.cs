using FluentValidation;

namespace Alexandria.Application.Users.Commands;

public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(v => v.UserId).NotEmpty();
        RuleFor(v => v.CurrentPassword).NotEmpty();
        RuleFor(v => v.NewPassword).NotEmpty().MinimumLength(6).MaximumLength(100);
    }
}
