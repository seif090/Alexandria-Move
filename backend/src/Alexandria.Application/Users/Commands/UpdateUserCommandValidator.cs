using FluentValidation;

namespace Alexandria.Application.Users.Commands;

public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty();
        RuleFor(v => v.FullName).MaximumLength(200).When(v => v.FullName != null);
        RuleFor(v => v.PhoneNumber).MaximumLength(20).When(v => v.PhoneNumber != null);
    }
}
