using Alexandria.API.Controllers;
using Alexandria.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Alexandria.API.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IIdentityService> _identityServiceMock;
    private readonly Mock<ICurrentUserService> _currentUserMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _identityServiceMock = new Mock<IIdentityService>();
        _currentUserMock = new Mock<ICurrentUserService>();
        _controller = new AuthController(_identityServiceMock.Object, _currentUserMock.Object);
    }

    [Fact]
    public async Task Login_ShouldReturnToken_WhenCredentialsValid()
    {
        // Arrange
        var request = new LoginRequest("test@test.com", "Test@123");
        _identityServiceMock.Setup(x => x.LoginAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync((true, "test-token", "test-refresh-token"));

        // Act
        var result = await _controller.Login(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenCredentialsInvalid()
    {
        // Arrange
        var request = new LoginRequest("test@test.com", "WrongPassword");
        _identityServiceMock.Setup(x => x.LoginAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync((false, string.Empty, string.Empty));

        // Act
        var result = await _controller.Login(request);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }
}
