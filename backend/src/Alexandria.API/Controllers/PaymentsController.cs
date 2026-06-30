using Alexandria.Application.Payments.Commands;
using Alexandria.Application.Payments.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[Authorize]
public class PaymentsController : BaseApiController
{
    private readonly IMediator _mediator;

    public PaymentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetPayments([FromQuery] GetPaymentsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPayment(Guid id)
    {
        var result = await _mediator.Send(new GetPaymentByIdQuery { Id = id });
        return OkOrNotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/refund")]
    [Authorize(Roles = "SuperAdmin,CommunityAdmin")]
    public async Task<IActionResult> RefundPayment(Guid id, [FromBody] RefundPaymentCommand command)
    {
        command.PaymentId = id;
        var result = await _mediator.Send(command);
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/capture")]
    public async Task<IActionResult> CapturePayment(Guid id)
    {
        var result = await _mediator.Send(new CapturePaymentCommand { PaymentId = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("{id:guid}/void")]
    public async Task<IActionResult> VoidPayment(Guid id)
    {
        var result = await _mediator.Send(new VoidPaymentCommand { PaymentId = id });
        if (!result.Succeeded) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{id:guid}/history")]
    public async Task<IActionResult> GetPaymentHistory(Guid id)
    {
        var result = await _mediator.Send(new GetPaymentHistoryQuery { PaymentId = id });
        return Ok(result);
    }

    [HttpGet("by-booking/{bookingId:guid}")]
    public async Task<IActionResult> GetPaymentsByBooking(Guid bookingId)
    {
        var result = await _mediator.Send(new GetPaymentsByBookingQuery { BookingId = bookingId });
        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyPayments([FromQuery] GetMyPaymentsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> HandleWebhook([FromBody] PaymentWebhookCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
