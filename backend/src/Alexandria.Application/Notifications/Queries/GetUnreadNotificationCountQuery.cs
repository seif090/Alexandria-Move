using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Notifications.Queries;

public class GetUnreadNotificationCountQuery : IRequest<Result<object>>
{
}