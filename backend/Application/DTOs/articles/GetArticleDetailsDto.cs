namespace Application.DTOs.articles;

public class GetArticleDetailsDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string? ExtraData { get; set; }

    public string Status { get; set; } = string.Empty;
}