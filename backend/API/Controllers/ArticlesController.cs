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

        var articles = await _articleService.GetMyArticlesAsync(user_id.Value, ct);
        return Ok(articles);
    }

    [HttpPost]
    public async Task<ActionResult<GetArticleDto>> Create([FromBody] CreateArticleDto request, CancellationToken ct)
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

    private Guid? GetUserId()
    {
        var value = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                    ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(value, out var id) ? id : null;
    }
}