using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Notifications.Queries;

public class GetNotificationByIdQuery : IRequest<Result<object>>
{
    public Guid Id { get; set; }
}