using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Drivers.Commands;

public class ApproveDriverCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
