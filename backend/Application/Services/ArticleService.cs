using System.Text.Json;
using Application.DTOs.articles;
using Application.Interfaces;
using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class ArticleService(IAppDbContext _db) : IArticleService
{
    public async Task<List<GetArticleDto>> GetMyArticlesAsync(
        Guid authorId,
        CancellationToken ct = default)
    {
        var articles = await _db.Articles
            .AsNoTracking()
            .Where(a => a.AuthorId == authorId)
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

    public async Task<GetArticleDto> CreateArticleAsync(
        Guid authorId,
        CreateArticleDto request,
        CancellationToken ct = default)
    {
        ValidateExtraData(request.ExtraData);

        var now = DateTime.UtcNow;

        var article = new Article
        {
            AuthorId = authorId,
            Title = request.Title.Trim(),
            Content = request.Content,
            ExtraData = string.IsNullOrWhiteSpace(request.ExtraData)
                ? null
                : request.ExtraData,
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
        CancellationToken ct = default)
    {
        return await db.Articles
            .AsNoTracking()
            .Where(a => a.Id == articleId && a.AuthorId == authorId)
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

    public async Task<GetExternalArticleDto?> GetExternalArticleByIdAsync(
        Guid articleId,
        CancellationToken ct = default)
    {
        return await db.Articles
            .AsNoTracking()
            .Where(a => a.Id == articleId)
            .Select(a => new GetExternalArticleDto
            {
                Title = a.Title,
                Content = a.Content
            })
            .FirstOrDefaultAsync(ct);
    }

    public async Task<bool> RejectArticleAsync(
        Guid articleId,
        Guid moderatorId,
        string comment,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(comment))
        {
            throw new ArgumentException("Комментарий обязателен.");
        }

        comment = comment.Trim();

        if (comment.Length > 2000)
        {
            throw new ArgumentException(
                "Комментарий не может быть длиннее 2000 символов.");
        }

        var article = await db.Articles
            .FirstOrDefaultAsync(a => a.Id == articleId, ct);

        if (article == null)
        {
            return false;
        }

        if (article.Status != ArticleStatus.OnModeration)
        {
            throw new InvalidOperationException(
                "Отклонить можно только статью со статусом OnModeration.");
        }

        article.Status = ArticleStatus.Rejected;
        article.UpdatedAt = DateTime.UtcNow;

        var history = new ArticleRejectionHistory(
            articleId,
            moderatorId,
            comment);

        db.ArticleRejectionHistories.Add(history);

        await db.SaveChangesAsync(ct);

        return true;
    }

    public async Task<bool> UpdateArticleAsync(
        Guid articleId,
        Guid authorId,
        UpdateArticleDto request,
        CancellationToken ct = default)
    {
        ValidateExtraData(request.ExtraData);


        var article = await db.Articles
            .FirstOrDefaultAsync(
                a => a.Id == articleId && a.AuthorId == authorId,
                ct);

        if (article == null)
        {
            return false;
        }


        if (article.Status != ArticleStatus.Draft &&
            article.Status != ArticleStatus.Rejected)
        {
            throw new InvalidOperationException(
                "Редактировать можно только черновик или отклонённую статью.");
        }

  
        article.Title = request.Title.Trim();
        article.Content = request.Content;
        article.ExtraData = string.IsNullOrWhiteSpace(request.ExtraData)
            ? null
            : request.ExtraData;

  
        article.Status = ArticleStatus.Draft;

        article.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        return true;
    }


    private static void ValidateExtraData(string? extraData)
    {
        if (string.IsNullOrWhiteSpace(extraData))
        {
            return;
        }

        try
        {
            using var document = JsonDocument.Parse(extraData);
        }
        catch (JsonException)
        {
            throw new ArgumentException(
                "Поле extraData должно содержать корректный JSON.");
        }
    }
}