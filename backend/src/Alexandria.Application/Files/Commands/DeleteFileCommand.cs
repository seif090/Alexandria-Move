using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Files.Commands;

public class DeleteFileCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
