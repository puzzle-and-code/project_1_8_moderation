using Application.DTOs.articles;

namespace Application.Interfaces.Services;

public interface IArticleService
{
    Task<List<GetArticleDto>> GetMyArticlesAsync(
        Guid authorId,
        bool moderatorQueue,
        CancellationToken ct = default);
    Task<GetArticleDto> CreateArticleAsync(Guid authorId, CreateArticleDto request, CancellationToken ct = default);

    Task<GetArticleDetailsDto?> GetArticleByIdAsync(
        Guid articleId,
        Guid authorId,
        bool asModerator,
        CancellationToken ct = default);

    Task<GetArticleDetailsDto?> SubmitArticleAsync(
        Guid articleId,
        Guid authorId,
        CancellationToken ct = default);

    Task<GetArticleDetailsDto?> UpdateArticleAsync(
        Guid articleId,
        Guid authorId,
        UpdateArticleDto request,
        CancellationToken ct = default);
}
