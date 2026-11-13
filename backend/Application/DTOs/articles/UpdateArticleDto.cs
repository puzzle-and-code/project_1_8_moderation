using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.articles;

public class UpdateArticleDto
{
    [MaxLength(200, ErrorMessage = "Название не может быть длиннее 200 символов")]
    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string? ExtraData { get; set; }
}
