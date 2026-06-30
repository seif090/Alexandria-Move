using Alexandria.Application.Roles.DTOs;
using MediatR;

namespace Alexandria.Application.Roles.Queries;

public class GetPermissionsQuery : IRequest<List<string>> { }
