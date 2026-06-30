using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Ratings.DTOs;
using Alexandria.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Ratings.Commands;

public class CreateRatingCommandHandler : IRequestHandler<CreateRatingCommand, Result<RatingDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUser;
    private readonly IDateTime _dateTime;

    public CreateRatingCommandHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUser, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _currentUser = currentUser;
        _dateTime = dateTime;
    }

    public async Task<Result<RatingDto>> Handle(CreateRatingCommand request, CancellationToken cancellationToken)
    {
        var rating = new Rating
        {
            UserId = Guid.Parse(_currentUser.UserId!),
            DriverId = request.DriverId,
            TripId = request.TripId,
            Score = request.Score,
            Comment = request.Comment,
            CreatedAt = _dateTime.UtcNow
        };

        _context.Ratings.Add(rating);

        if (request.DriverId.HasValue)
        {
            var avgScore = await _context.Ratings
                .Where(r => r.DriverId == request.DriverId)
                .AverageAsync(r => (double?)r.Score, cancellationToken) ?? request.Score;

            var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.Id == request.DriverId, cancellationToken);
            if (driver != null) driver.Rating = Math.Round(avgScore, 2);
        }

        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<RatingDto>(rating);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == _currentUser.UserId, cancellationToken);
        if (user != null) dto.UserName = user.FullName;

        return Result<RatingDto>.Success(dto);
    }
}
