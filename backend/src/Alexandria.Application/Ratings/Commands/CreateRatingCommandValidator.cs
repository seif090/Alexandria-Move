using FluentValidation;

namespace Alexandria.Application.Ratings.Commands;

public class CreateRatingCommandValidator : AbstractValidator<CreateRatingCommand>
{
    public CreateRatingCommandValidator()
    {
        RuleFor(v => v.Score).InclusiveBetween(1, 5);
        RuleFor(v => v.Comment).MaximumLength(1000);
    }
}
