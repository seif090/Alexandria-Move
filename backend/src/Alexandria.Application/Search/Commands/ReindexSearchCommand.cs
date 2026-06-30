using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Search.Commands;

public class ReindexSearchCommand : IRequest<Result>
{
}