// Файл: Application/Services/UserService.cs
using Domain.Exceptions;
using Application.DTOs.auth;
using Application.DTOs.auth.Tokens;
using Application.Interfaces;
using Application.Interfaces.Services;
using BCrypt.Net;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Domain.Entities.UnTabled;



namespace Application.Services;

public class UserService(IAppDbContext _db, IJwtProvider _jwtProvider) : IUserService
{


    public async Task<Roles?> GetUserRole(Guid userId, CancellationToken ct = default)
    {

        User? user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);


        if (user == null)
        {
            return null;
        }


        return user.Role;
    }


    public async Task<int?> GetUserIntRole(Guid userId, CancellationToken ct = default)
    {
        Roles? role = await GetUserRole(userId, ct);

        if (!role.HasValue)
            return null;

        return (int)role.Value;
    }


    public async Task<TokensAcReDto> RefreshTokenAsync(RefreshTokenRequestDto request, CancellationToken ct = default)
    {
        var token_hash = HashToken(request.RefreshToken);

        // Ищем токен в БД вместе с пользователем (Include нужен, чтобы потом сгенерировать Access-токен)
        var existing_token = await _db.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.TokenHash == token_hash, ct);

        // Проверяем: существует ли токен, не отозван ли он и не истёк ли срок годности
        if (existing_token == null || existing_token.RevokedAt != null || existing_token.ExpiresAt < DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Невалидный или просроченный Refresh Token.");
        }

        // Помечаем старый токен как отозванный (Token Rotation)
        existing_token.RevokedAt = DateTime.UtcNow;

        // Генерируем новую пару токенов
        var access_token = _jwtProvider.GenerateAccessToken(existing_token.User);
        var refresh_token = _jwtProvider.GenerateRefreshToken();

        var RefreshToken = new RefreshToken
        {
            UserId = existing_token.User.Id,
            TokenHash = HashToken(access_token),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        _db.RefreshTokens.Add(RefreshToken);
        await _db.SaveChangesAsync(ct);

        return new TokensAcReDto
        {
            AccessToken = access_token,
            RefreshToken = refresh_token
        };
    }

    public async Task LogoutAsync(LogoutRequestDto request, CancellationToken ct = default)
    {
        var token_hash = HashToken(request.RefreshToken);

        // Ищем токен
        var existing_oken = await _db.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.TokenHash == token_hash, ct);

        // Если токен найден и ещё не отозван — отзываем его
        if (existing_oken != null && existing_oken.RevokedAt == null)
        {
            existing_oken.RevokedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync(ct);
        }
    }

    public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        if (await _db.Users.AnyAsync(u => u.Email == email, ct))
        {
            throw new ConflictException("Пользователь с таким email уже существует.");
        }

        var user = new User
        {
            Email = email,
            DisplayName = request.DisplayName,
            PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(request.Password)
        };

        var access_token = _jwtProvider.GenerateAccessToken(user);
        var refresh_token = _jwtProvider.GenerateRefreshToken();

        var RefreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = HashToken(refresh_token),
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            User = user
        };

        _db.Users.Add(user);
        _db.RefreshTokens.Add(RefreshToken);
        await _db.SaveChangesAsync(ct);

        return new RegisterResponseDto
        {
            Tokens = new DTOs.auth.Tokens.TokensAcReDto
            {
                AccessToken = access_token,
                RefreshToken = refresh_token
            }
        };
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

        if (user == null || !BCrypt.Net.BCrypt.EnhancedVerify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Неверный email или пароль.");
        }

        var access_token = _jwtProvider.GenerateAccessToken(user);
        var refresh_token = _jwtProvider.GenerateRefreshToken();

        var RefreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = HashToken(refresh_token),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        _db.RefreshTokens.Add(RefreshToken);
        await _db.SaveChangesAsync(ct);

        return new LoginResponseDto
        {
            Tokens = new DTOs.auth.Tokens.TokensAcReDto
            {
                AccessToken = access_token,
                RefreshToken = refresh_token
            }
        };
    }

    // Вспомогательный метод для хеширования SHA-256
    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}