using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Payments.DTOs;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Payments.Commands;

public class ProcessPaymentCommandHandler : IRequestHandler<ProcessPaymentCommand, Result<PaymentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPaymentService _paymentService;
    private readonly ICurrentUserService _currentUser;
    private readonly IDateTime _dateTime;

    public ProcessPaymentCommandHandler(IApplicationDbContext context, IMapper mapper, IPaymentService paymentService, ICurrentUserService currentUser, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _paymentService = paymentService;
        _currentUser = currentUser;
        _dateTime = dateTime;
    }

    public async Task<Result<PaymentDto>> Handle(ProcessPaymentCommand request, CancellationToken cancellationToken)
    {
        var (success, transactionId, message) = await _paymentService.ProcessPaymentAsync(
            request.Amount, request.Currency, request.PaymentMethod, request.Metadata);

        if (!success) return Result<PaymentDto>.Failure(message);

        var payment = new Payment
        {
            UserId = Guid.Parse(_currentUser.UserId!),
            BookingId = request.BookingId.Value,
            Amount = request.Amount,
            Currency = request.Currency,
            Method = Enum.Parse<PaymentMethod>(request.PaymentMethod, true),
            PaymentMethod = request.PaymentMethod,
            TransactionId = transactionId,
            Status = PaymentStatus.Completed,
            PaidAt = _dateTime.UtcNow
        };

        _context.Payments.Add(payment);

        if (request.BookingId.HasValue)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == request.BookingId, cancellationToken);
            if (booking != null) booking.Status = BookingStatus.Active;
        }

        await _context.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<PaymentDto>(payment);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == _currentUser.UserId, cancellationToken);
        if (user != null) dto.UserName = user.FullName;

        return Result<PaymentDto>.Success(dto);
    }
}
