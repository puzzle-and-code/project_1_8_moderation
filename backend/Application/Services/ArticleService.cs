using System.Text.Json;
using Application.DTOs.articles;
using Application.Interfaces;
using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class ArticleService(IAppDbContext _db) : IArticleService
{
    public async Task<List<GetArticleDto>> GetMyArticlesAsync(
        Guid authorId,
        bool moderatorQueue,
        CancellationToken ct = default)
    {
        var query = _db.Articles.AsNoTracking();
        query = moderatorQueue
            ? query.Where(a => a.Status == ArticleStatus.OnModeration)
            : query.Where(a => a.AuthorId == authorId);

        var articles = await query
            .OrderByDescending(a => a.UpdatedAt)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.Status,
                a.UpdatedAt
            })
            .ToListAsync(ct);

        return articles
            .Select(a => new GetArticleDto
            {
                Id = a.Id,
                Title = a.Title,
                Status = a.Status.ToString(),
                UpdatedAt = a.UpdatedAt
            })
            .ToList();
    }

    public async Task<GetArticleDto> CreateArticleAsync(Guid authorId, CreateArticleDto request, CancellationToken ct = default)
    {
        var extraData = NormalizeExtraData(request.ExtraData);
        var now = DateTime.UtcNow;

        var article = new Article
        {
            AuthorId = authorId,
            Title = request.Title.Trim(),
            Content = request.Content,
            ExtraData = extraData,
            Status = ArticleStatus.Draft,
            CreatedAt = now,
            UpdatedAt = now
        };

        _db.Articles.Add(article);
        await _db.SaveChangesAsync(ct);

        return new GetArticleDto
        {
            Id = article.Id,
            Title = article.Title,
            Status = article.Status.ToString(),
            UpdatedAt = article.UpdatedAt
        };
    }

    public async Task<GetArticleDetailsDto?> GetArticleByIdAsync(
        Guid articleId,
        Guid authorId,
        bool asModerator,
        CancellationToken ct = default)
    {
        return await _db.Articles
            .AsNoTracking()
            .Where(a => a.Id == articleId && (
                a.AuthorId == authorId ||
                (asModerator && a.Status == ArticleStatus.OnModeration)))
            .Select(a => new GetArticleDetailsDto
            {
                Id = a.Id,
                Title = a.Title,
                Content = a.Content,
                ExtraData = a.ExtraData,
                Status = a.Status.ToString()
            })
            .FirstOrDefaultAsync(ct);
    }

    public async Task<GetArticleDetailsDto?> UpdateArticleAsync(
        Guid articleId,
        Guid authorId,
        UpdateArticleDto request,
        CancellationToken ct = default)
    {
        var extraData = NormalizeExtraData(request.ExtraData);

        var article = await _db.Articles
            .FirstOrDefaultAsync(a => a.Id == articleId && a.AuthorId == authorId, ct);

        if (article is null)
        {
            return null;
        }

        if (article.Status == ArticleStatus.OnModeration)
        {
            throw new ConflictException("Статью на модерации нельзя изменить.");
        }

        article.Title = (request.Title ?? string.Empty).Trim();
        article.Content = request.Content ?? string.Empty;
        article.ExtraData = extraData;
        article.UpdatedAt = DateTime.UtcNow;

        if (article.Status is ArticleStatus.Published or ArticleStatus.Rejected)
        {
            article.Status = ArticleStatus.Draft;
        }

        await _db.SaveChangesAsync(ct);

        return ToDetailsDto(article);
    }

    public async Task<GetArticleDetailsDto?> SubmitArticleAsync(
        Guid articleId,
        Guid authorId,
        CancellationToken ct = default)
    {
        var article = await _db.Articles
            .FirstOrDefaultAsync(a => a.Id == articleId && a.AuthorId == authorId, ct);

        if (article is null)
        {
            return null;
        }

        if (article.Status != ArticleStatus.Draft)
        {
            throw new ConflictException("На модерацию можно отправить только черновик.");
        }

        if (string.IsNullOrWhiteSpace(article.Title) || string.IsNullOrWhiteSpace(article.Content))
        {
            throw new ArgumentException("На модерацию можно отправить статью с названием и содержанием.");
        }

        article.Status = ArticleStatus.OnModeration;
        article.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return ToDetailsDto(article);
    }

    private static GetArticleDetailsDto ToDetailsDto(Article article) => new()
    {
        Id = article.Id,
        Title = article.Title,
        Content = article.Content,
        ExtraData = article.ExtraData,
        Status = article.Status.ToString()
    };

    private static string? NormalizeExtraData(string? extraData)
    {
        if (string.IsNullOrWhiteSpace(extraData))
        {
            return null;
        }

        try
        {
            using var _ = JsonDocument.Parse(extraData);
        }
        catch (JsonException)
        {
            throw new ArgumentException("Поле extraData должно содержать корректный JSON.");
        }

        return extraData;
    }
}
