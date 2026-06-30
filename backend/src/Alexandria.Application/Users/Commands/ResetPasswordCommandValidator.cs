using FluentValidation;

namespace Alexandria.Application.Users.Commands;

public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(v => v.Email).NotEmpty().EmailAddress();
        RuleFor(v => v.Token).NotEmpty();
        RuleFor(v => v.NewPassword).NotEmpty().MinimumLength(6).MaximumLength(100);
    }
}
