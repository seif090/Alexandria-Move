using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Users.Commands;
using Alexandria.Application.Users.DTOs;
using Alexandria.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Alexandria.Application.Tests.Users.Commands;

public class CreateUserCommandHandlerTests
{
    private readonly Mock<IApplicationDbContext> _contextMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IIdentityService> _identityServiceMock;
    private readonly Mock<IDateTime> _dateTimeMock;
    private readonly CreateUserCommandHandler _handler;

    public CreateUserCommandHandlerTests()
    {
        _contextMock = new Mock<IApplicationDbContext>();
        _mapperMock = new Mock<IMapper>();
        _identityServiceMock = new Mock<IIdentityService>();
        _dateTimeMock = new Mock<IDateTime>();
        _handler = new CreateUserCommandHandler(
            _contextMock.Object,
            _mapperMock.Object,
            _identityServiceMock.Object,
            _dateTimeMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldCreateUser_WhenValidRequest()
    {
        // Arrange
        var command = new CreateUserCommand
        {
            FullName = "Test User",
            Email = "test@example.com",
            Password = "Test@123",
            PhoneNumber = "+201234567890"
        };

        _identityServiceMock.Setup(x => x.RegisterAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync((true, "Success"));

        _identityServiceMock.Setup(x => x.GetUserByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync(new User
            {
                Id = Guid.NewGuid(),
                FullName = command.FullName,
                Email = command.Email,
                CreatedAt = DateTime.UtcNow
            });

        var usersMock = new Mock<DbSet<User>>();
        _contextMock.Setup(x => x.Users).Returns(usersMock.Object);
        _contextMock.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
    }
}
