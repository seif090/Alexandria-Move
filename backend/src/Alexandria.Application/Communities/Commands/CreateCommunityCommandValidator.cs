using FluentValidation;

namespace Alexandria.Application.Communities.Commands;

public class CreateCommunityCommandValidator : AbstractValidator<CreateCommunityCommand>
{
    public CreateCommunityCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(200);
        RuleFor(v => v.City).NotEmpty().MaximumLength(100);
        RuleFor(v => v.Area).NotEmpty().MaximumLength(100);
        RuleFor(v => v.Type).NotEmpty();
        RuleFor(v => v.MaxMembers).GreaterThan(0);
    }
}
