using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Files.Queries;

public class GetFileByIdQuery : IRequest<Result<object>>
{
    public Guid Id { get; set; }
}