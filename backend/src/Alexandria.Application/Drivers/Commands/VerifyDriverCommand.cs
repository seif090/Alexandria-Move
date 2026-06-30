using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Drivers.Commands;

public class VerifyDriverCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
