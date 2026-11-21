<<<<<<< HEAD
﻿using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
=======
﻿// Файл: API/Controllers/AuthController.cs
>>>>>>> 7158d40a8816a1df1f66a34e3046ba68040d7f05
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
    public async Task<ActionResult<RegisterResponseDto>> Register(
        [FromBody] RegisterRequestDto request,
        CancellationToken ct)
    {
        try
        {
<<<<<<< HEAD
            var result = await userService.RegisterAsync(request, ct);

=======
            var result = await _userService.RegisterAsync(request, ct);
>>>>>>> 7158d40a8816a1df1f66a34e3046ba68040d7f05
            return Created("/api/auth/me", result);
        }
        catch (ConflictException ex)
        {
<<<<<<< HEAD
            return Conflict(new { error = ex.Message });
=======
            // 409 — ресурс конфликтует с уже существующим
            return Conflict(ex.Message);
>>>>>>> 7158d40a8816a1df1f66a34e3046ba68040d7f05
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
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
            return Unauthorized(ex.Message);
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
        return Unauthorized(ex.Message);
        }
    }

    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        [FromBody] LogoutRequestDto request,
        CancellationToken ct)
    {
        await _userService.LogoutAsync(request, ct);

        return Ok(new
        {
            message = "Вы успешно вышли из системы."
        });
    }

   
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<MeResponseDto> Me()
    {
<<<<<<< HEAD
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                     ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
=======
        // При выдаче токена идентификатор кладётся в claim "sub".
        // Проверяем оба имени: при включённом MapInboundClaims claim "sub"
        // переименовывается в ClaimTypes.NameIdentifier.
        //var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
        //             ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
>>>>>>> 7158d40a8816a1df1f66a34e3046ba68040d7f05

        // тут возвращаем GUID, хз можно и str, но подумал так лучше

<<<<<<< HEAD
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
=======
        


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
>>>>>>> 7158d40a8816a1df1f66a34e3046ba68040d7f05
    }
}
