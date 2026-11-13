
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.DTOs.articles;
using Application.Interfaces.Services;
using Domain.Entities.UnTabled;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/articles")]
[Authorize]
public class ArticlesController(IArticleService _articleService) : ControllerBase
{
    [HttpGet("mine")]
    public async Task<ActionResult<List<GetArticleDto>>> GetMine(CancellationToken ct)
    {
        var user_id = GetUserId();
        if (user_id is null)
        {
            return Unauthorized(new { error = "Не удалось определить пользователя." });
        }

        var articles = await _articleService.GetMyArticlesAsync(
            user_id.Value,
            IsModerator(),
            ct);
        return Ok(articles);
    }

    [HttpPost]
    public async Task<ActionResult<GetArticleDto>> Create(
        [FromBody] CreateArticleDto request,
        CancellationToken ct)
    {
        var user_id = GetUserId();
        if (user_id is null)
        {
            return Unauthorized(new { error = "Не удалось определить пользователя." });
        }

        try
        {
            var article = await _articleService.CreateArticleAsync(user_id.Value, request, ct);
            return StatusCode(StatusCodes.Status201Created, article);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // Получение полной информации о собственной статье
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetArticleDetailsDto>> GetById(
        Guid id,
        CancellationToken ct)
    {
        var userId = GetUserId();

        if (userId is null)
        {
            return Unauthorized(new { error = "Не удалось определить пользователя." });
        }

        var article = await _articleService.GetArticleByIdAsync(
            id,
            userId.Value,
            IsModerator(),
            ct);

        if (article is null)
        {
            return NotFound(new { error = "Статья не найдена." });
        }

        return Ok(article);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<GetArticleDetailsDto>> Update(
        Guid id,
        [FromBody] UpdateArticleDto request,
        CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { error = "Не удалось определить пользователя." });
        }

        try
        {
            var article = await _articleService.UpdateArticleAsync(id, userId.Value, request, ct);
            if (article is null)
            {
                return NotFound(new { error = "Статья не найдена." });
            }

            return Ok(article);
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

    [HttpPost("{id:guid}/submit")]
    public async Task<ActionResult<GetArticleDetailsDto>> Submit(Guid id, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { error = "Не удалось определить пользователя." });
        }

        try
        {
            var article = await _articleService.SubmitArticleAsync(id, userId.Value, ct);
            if (article is null)
            {
                return NotFound(new { error = "Статья не найдена." });
            }

            return Ok(article);
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

    private bool IsModerator() => User.IsInRole(nameof(Roles.Moderator));

    private Guid? GetUserId()
    {
        var value = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                    ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(value, out var id) ? id : null;
    }
}
