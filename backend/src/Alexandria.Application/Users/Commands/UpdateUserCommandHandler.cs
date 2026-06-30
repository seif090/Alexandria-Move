using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Users.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Users.Commands;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result<UserDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateUserCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<UserDto>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
        if (user == null) return Result<UserDto>.Failure("User not found");

        if (request.FullName != null) user.FullName = request.FullName;
        if (request.PhoneNumber != null) user.PhoneNumber = request.PhoneNumber;
        if (request.ProfileImageUrl != null) user.ProfileImageUrl = request.ProfileImageUrl;
        if (request.DateOfBirth.HasValue) user.DateOfBirth = request.DateOfBirth;
        if (request.Address != null) user.Address = request.Address;
        if (request.Gender != null && Enum.TryParse<Gender>(request.Gender, true, out var gender)) user.Gender = gender;

        await _context.SaveChangesAsync(cancellationToken);
        var dto = _mapper.Map<UserDto>(user);
        dto.Roles = await _context.UserRoles.Where(ur => ur.UserId == user.Id).Select(ur => ur.Role.Name).ToListAsync(cancellationToken);
        return Result<UserDto>.Success(dto);
    }
}
