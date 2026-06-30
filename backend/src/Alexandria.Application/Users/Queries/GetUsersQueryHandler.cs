using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Users.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Users.Queries;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PaginatedList<UserDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetUsersQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(u => u.FullName.ToLower().Contains(term) || u.Email.ToLower().Contains(term) || (u.PhoneNumber != null && u.PhoneNumber.Contains(term)));
        }

        if (request.IsActive.HasValue)
            query = query.Where(u => u.Status == (request.IsActive.Value ? UserStatus.Active : UserStatus.Inactive));

        if (request.IsVerified.HasValue)
            query = query.Where(u => u.IsVerified == request.IsVerified.Value);

        if (request.RegisteredFrom.HasValue)
            query = query.Where(u => u.RegistrationDate >= request.RegisteredFrom.Value);

        if (request.RegisteredTo.HasValue)
            query = query.Where(u => u.RegistrationDate <= request.RegisteredTo.Value);

        if (!string.IsNullOrWhiteSpace(request.RoleName))
        {
            query = query.Where(u => u.Roles.Any(ur => ur.Role.Name == request.RoleName));
        }

        query = request.SortBy switch
        {
            "fullName" => request.SortDescending ? query.OrderByDescending(u => u.FullName) : query.OrderBy(u => u.FullName),
            "email" => request.SortDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
            "registrationDate" => request.SortDescending ? query.OrderByDescending(u => u.RegistrationDate) : query.OrderBy(u => u.RegistrationDate),
            "lastLogin" => request.SortDescending ? query.OrderByDescending(u => u.LastLogin) : query.OrderBy(u => u.LastLogin),
            "status" => request.SortDescending ? query.OrderByDescending(u => u.Status) : query.OrderBy(u => u.Status),
            _ => query.OrderByDescending(u => u.RegistrationDate)
        };

        return await PaginatedList<UserDto>.CreateAsync(
            query.ProjectTo<UserDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
