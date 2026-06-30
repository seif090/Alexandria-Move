using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Communities.DTOs;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Communities.Commands;

public class CreateCommunityCommandHandler : IRequestHandler<CreateCommunityCommand, Result<CommunityDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUser;
    private readonly IDateTime _dateTime;

    public CreateCommunityCommandHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUser, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _currentUser = currentUser;
        _dateTime = dateTime;
    }

    public async Task<Result<CommunityDto>> Handle(CreateCommunityCommand request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<CommunityType>(request.Type, true, out var type))
            return Result<CommunityDto>.Failure("Invalid community type");

        var community = new Community
        {
            Name = request.Name,
            Description = request.Description,
            LogoUrl = request.LogoUrl,
            Type = type,
            City = request.City,
            Area = request.Area,
            IsApproved = false,
            MaxMembers = request.MaxMembers,
            CreatedById = Guid.Parse(_currentUser.UserId!),
            CreatedAt = _dateTime.UtcNow
        };

        _context.Communities.Add(community);
        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<CommunityDto>(community);
        dto.MemberCount = 0;
        return Result<CommunityDto>.Success(dto);
    }
}
