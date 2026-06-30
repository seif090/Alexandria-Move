using FluentValidation;

namespace Alexandria.Application.Members.Commands;

public class AddMemberCommandValidator : AbstractValidator<AddMemberCommand>
{
    public AddMemberCommandValidator()
    {
        RuleFor(v => v.CommunityId).NotEmpty();
        RuleFor(v => v.UserId).NotEmpty();
    }
}
