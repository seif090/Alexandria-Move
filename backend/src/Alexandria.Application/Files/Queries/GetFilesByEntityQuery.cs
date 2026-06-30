using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Files.Queries;

public class GetFilesByEntityQuery : IRequest<Result<object>>
{
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
}