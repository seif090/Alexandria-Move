using FluentValidation;

namespace Alexandria.Application.Bookings.Commands;

public class CreateBookingCommandValidator : AbstractValidator<CreateBookingCommand>
{
    public CreateBookingCommandValidator()
    {
        RuleFor(v => v.GroupId).NotEmpty();
    }
}
