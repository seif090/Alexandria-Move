using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Members.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Members.Queries;

public class GetMembersQueryHandler : IRequestHandler<GetMembersQuery, PaginatedList<MemberDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetMembersQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<MemberDto>> Handle(GetMembersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.CommunityMembers
            .Include(m => m.User)
            .Include(m => m.Community)
            .AsQueryable();

        if (request.CommunityId.HasValue)
            query = query.Where(m => m.CommunityId == request.CommunityId.Value);

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<MemberStatus>(request.Status, true, out var status))
            query = query.Where(m => m.Status == status);

        if (!string.IsNullOrWhiteSpace(request.Role) && Enum.TryParse<MemberRole>(request.Role, true, out var role))
            query = query.Where(m => m.Role == role);

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(m => m.User.FullName.ToLower().Contains(term) || m.User.Email.ToLower().Contains(term));
        }

        query = request.SortBy switch
        {
            "joinedAt" => request.SortDescending ? query.OrderByDescending(m => m.JoinedAt) : query.OrderBy(m => m.JoinedAt),
            "userName" => request.SortDescending ? query.OrderByDescending(m => m.User.FullName) : query.OrderBy(m => m.User.FullName),
            "status" => request.SortDescending ? query.OrderByDescending(m => m.Status) : query.OrderBy(m => m.Status),
            _ => query.OrderByDescending(m => m.JoinedAt)
        };

        return await PaginatedList<MemberDto>.CreateAsync(
            query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
