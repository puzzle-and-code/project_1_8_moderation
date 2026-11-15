
using Application.DTOs.articles;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/ext")]
[AllowAnonymous]
public class ExternalArticlesController(IArticleService articleService) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetExternalArticleDto>> GetById(
        Guid id,
        CancellationToken ct)
    {
        var article = await articleService.GetExternalArticleByIdAsync(
            id,
            ct);

        if (article is null)
        {
            return NotFound(new { error = "Статья не найдена." });
        }

        return Ok(article);
    }
}
