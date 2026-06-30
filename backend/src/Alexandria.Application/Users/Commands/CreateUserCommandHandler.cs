using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Users.DTOs;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Users.Commands;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<UserDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IIdentityService _identityService;
    private readonly IDateTime _dateTime;

    public CreateUserCommandHandler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _identityService = identityService;
        _dateTime = dateTime;
    }

    public async Task<Result<UserDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var (success, message) = await _identityService.RegisterAsync(request.FullName, request.Email, request.Password, request.PhoneNumber ?? string.Empty);
        if (!success) return Result<UserDto>.Failure(message);

        var user = await _identityService.GetUserByEmailAsync(request.Email);
        if (user == null) return Result<UserDto>.Failure("User creation failed");

        user.DateOfBirth = request.DateOfBirth;
        user.Address = request.Address;
        if (Enum.TryParse<Gender>(request.Gender, true, out var gender)) user.Gender = gender;

        if (request.Roles?.Any() == true)
        {
            var roles = await _context.Roles.Where(r => request.Roles.Contains(r.Name)).ToListAsync(cancellationToken);
            foreach (var role in roles)
            {
                _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.Id, AssignedAt = _dateTime.UtcNow });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        var dto = _mapper.Map<UserDto>(user);
        dto.Roles = await _context.UserRoles.Where(ur => ur.UserId == user.Id).Select(ur => ur.Role.Name).ToListAsync(cancellationToken);
        return Result<UserDto>.Success(dto);
    }
}
