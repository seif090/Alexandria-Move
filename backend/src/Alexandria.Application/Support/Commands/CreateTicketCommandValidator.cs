using FluentValidation;

namespace Alexandria.Application.Support.Commands;

public class CreateTicketCommandValidator : AbstractValidator<CreateTicketCommand>
{
    public CreateTicketCommandValidator()
    {
        RuleFor(v => v.Subject).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Message).NotEmpty().MaximumLength(5000);
        RuleFor(v => v.Priority).NotEmpty();
    }
}
