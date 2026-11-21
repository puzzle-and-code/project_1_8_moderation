namespace Domain.Entities;

public class ArticleRejectionHistory
{
    private ArticleRejectionHistory()
    {
    }

    public Guid Id { get; private set; }

    public Guid ArticleId { get; private set; }

    public Guid ModeratorId { get; private set; }

    public string Comment { get; private set; } = string.Empty;

    public DateTime CreatedAt { get; private set; }

    public ArticleRejectionHistory(
        Guid articleId,
        Guid moderatorId,
        string comment)
    {
        Id = Guid.NewGuid();
        ArticleId = articleId;
        ModeratorId = moderatorId;
        Comment = comment;
        CreatedAt = DateTime.UtcNow;
    }
}