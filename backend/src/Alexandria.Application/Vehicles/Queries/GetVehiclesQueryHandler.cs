using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Vehicles.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Vehicles.Queries;

public class GetVehiclesQueryHandler : IRequestHandler<GetVehiclesQuery, PaginatedList<VehicleDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetVehiclesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<VehicleDto>> Handle(GetVehiclesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Vehicles.Include(v => v.Driver.User).AsQueryable();

        if (request.DriverId.HasValue)
            query = query.Where(v => v.DriverId == request.DriverId.Value);

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<VehicleStatus>(request.Status, true, out var status))
            query = query.Where(v => v.Status == status);

        if (!string.IsNullOrWhiteSpace(request.Type) && Enum.TryParse<VehicleType>(request.Type, true, out var type))
            query = query.Where(v => v.Type == type);

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(v => v.PlateNumber.ToLower().Contains(term) || v.Model.ToLower().Contains(term));
        }

        query = request.SortBy switch
        {
            "plateNumber" => request.SortDescending ? query.OrderByDescending(v => v.PlateNumber) : query.OrderBy(v => v.PlateNumber),
            "model" => request.SortDescending ? query.OrderByDescending(v => v.Model) : query.OrderBy(v => v.Model),
            "year" => request.SortDescending ? query.OrderByDescending(v => v.Year) : query.OrderBy(v => v.Year),
            _ => query.OrderByDescending(v => v.CreatedAt)
        };

        return await PaginatedList<VehicleDto>.CreateAsync(
            query.ProjectTo<VehicleDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
