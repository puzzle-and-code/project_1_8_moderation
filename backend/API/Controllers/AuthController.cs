using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.DTOs.auth;
using Application.DTOs.auth.Tokens;
using Application.Interfaces;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IUserService userService) : ControllerBase
{
  
    [HttpPost("register")]
    public async Task<ActionResult<RegisterResponseDto>> Register(
        [FromBody] RegisterRequestDto request,
        CancellationToken ct)
    {
        try
        {
            var result = await userService.RegisterAsync(request, ct);

            return Created("/api/auth/me", result);
        }
        catch (ConflictException ex)
        {
            return Conflict(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(
        [FromBody] LoginRequestDto request,
        CancellationToken ct)
    {
        try
        {
            var result = await userService.LoginAsync(request, ct);

            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    
    [HttpPost("refresh")]
    public async Task<ActionResult<TokensAcReDto>> Refresh(
        [FromBody] RefreshTokenRequestDto request,
        CancellationToken ct)
    {
        try
        {
            var result = await userService.RefreshTokenAsync(request, ct);

            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        [FromBody] LogoutRequestDto request,
        CancellationToken ct)
    {
        await userService.LogoutAsync(request, ct);

        return Ok(new
        {
            message = "Вы успешно вышли из системы."
        });
    }

   
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<object> Me()
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                     ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value
                    ?? User.FindFirst(ClaimTypes.Email)?.Value;

        var name = User.FindFirst("display_name")?.Value;

        
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userId is null)
        {
            return Unauthorized(new
            {
                error = "Токен не содержит идентификатора пользователя."
            });
        }

        return Ok(new
        {
            id = userId,
            email,
            name,
            role
        });
    }
}
