
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.DTOs.articles;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/articles")]
[Authorize]
public class ArticlesController(IArticleService articleService) : ControllerBase
{
    [HttpGet("mine")]
    public async Task<ActionResult<List<GetArticleDto>>> GetMine(
        CancellationToken ct)
    {
        var userId = GetUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                error = "Не удалось определить пользователя."
            });
        }

        var articles = await articleService.GetMyArticlesAsync(
            userId.Value,
            ct);

        return Ok(articles);
    }

    [HttpPost]
    public async Task<ActionResult<GetArticleDto>> Create(
        [FromBody] CreateArticleDto request,
        CancellationToken ct)
    {
        var userId = GetUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                error = "Не удалось определить пользователя."
            });
        }

        try
        {
            var article = await articleService.CreateArticleAsync(
                userId.Value,
                request,
                ct);

            return StatusCode(StatusCodes.Status201Created, article);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetArticleDetailsDto>> GetById(
        Guid id,
        CancellationToken ct)
    {
        var userId = GetUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                error = "Не удалось определить пользователя."
            });
        }

        var article = await articleService.GetArticleByIdAsync(
            id,
            userId.Value,
            ct);

        if (article is null)
        {
            return NotFound(new { error = "Статья не найдена." });
        }

        return Ok(article);
    }

    // Редактирование собственной статьи автором
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateArticleDto request,
        CancellationToken ct)
    {
        var authorId = GetUserId();

        if (authorId is null)
        {
            return Unauthorized(new
            {
                error = "Не удалось определить пользователя."
            });
        }

        try
        {
            var updated = await articleService.UpdateArticleAsync(
                id,
                authorId.Value,
                request,
                ct);

            if (!updated)
            {
                return NotFound(new
                {
                    error = "Статья не найдена."
                });
            }

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    // Отклонение статьи модератором
    [HttpPost("{id:guid}/reject")]
    [Authorize(Roles = "Moderator")]
    public async Task<IActionResult> Reject(
        Guid id,
        [FromBody] RejectArticleDto request,
        CancellationToken ct)
    {
        var moderatorId = GetUserId();

        if (moderatorId is null)
        {
            return Unauthorized(new
            {
                error = "Не удалось определить пользователя."
            });
        }

        try
        {
            var rejected = await articleService.RejectArticleAsync(
                id,
                moderatorId.Value,
                request.Comment,
                ct);

            if (!rejected)
            {
                return NotFound(new
                {
                    error = "Статья не найдена."
                });
            }

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    private Guid? GetUserId()
    {
        var value = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                    ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(value, out var id) ? id : null;
    }
}
