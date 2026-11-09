// Файл: API/Controllers/AuthController.cs
using Application.DTOs.auth;
using Application.DTOs.auth.Tokens;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Services;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IUserService _userService, IClaimService _claimService) : FundomentalController
{


    [HttpPost("register")]
    public async Task<ActionResult<RegisterResponseDto>> Register([FromBody] RegisterRequestDto request, CancellationToken ct)
    {
        try
        {
            var result = await _userService.RegisterAsync(request, ct);
            return Created("/api/auth/me", result);
        }

        catch (ConflictException ex)
        {
            // 409 — ресурс конфликтует с уже существующим
            return Conflict(ex.Message);
        }

        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request, CancellationToken ct)
    {
        try
        {
            var result = await _userService.LoginAsync(request, ct);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
    }


    [HttpPost("refresh")]
    public async Task<ActionResult<TokensAcReDto>> Refresh([FromBody] RefreshTokenRequestDto request, CancellationToken ct)
    {
        try
        {
            var result = await _userService.RefreshTokenAsync(request, ct);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            // Возвращаем 401, чтобы фронтенд понял, что токен умер и нужно перекинуть юзера на страницу логина
            return Unauthorized(ex.Message);
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutRequestDto request, CancellationToken ct)
    {
        await _userService.LogoutAsync(request, ct);

        // При логауте обычно просто возвращаем 200 OK без данных
        return Ok(new { message = "Вы успешно вышли из системы." });
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<MeResponseDto> Me()
    {
        // При выдаче токена идентификатор кладётся в claim "sub".
        // Проверяем оба имени: при включённом MapInboundClaims claim "sub"
        // переименовывается в ClaimTypes.NameIdentifier.
        //var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
        //             ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // тут возвращаем GUID, хз можно и str, но подумал так лучше

        


        Guid? user_id = _claimService.GetUserId();


        if (user_id is null)
            return Unauthorized(new { error = "Токен не содержит идентификатора пользователя." });

        

        string? email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value
            ?? User.FindFirst(ClaimTypes.Email)?.Value;

        // Имя поля "name" — так оно названо в контракте фронтенда (types/auth.ts)
        string? name = User.FindFirst("display_name")?.Value;


        MeResponseDto response = new()
        {
            UserId = user_id,
            Email = email,
            Name = name
        };





        return Ok(response);
    }
}