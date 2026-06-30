using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Stops.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Stops.Queries;

public class GetStopByIdQueryHandler : IRequestHandler<GetStopByIdQuery, Result<StopDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetStopByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<StopDto>> Handle(GetStopByIdQuery request, CancellationToken cancellationToken)
    {
        var stop = await _context.Stops.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);
        if (stop == null) return Result<StopDto>.Failure("Stop not found");

        return Result<StopDto>.Success(_mapper.Map<StopDto>(stop));
    }
}
