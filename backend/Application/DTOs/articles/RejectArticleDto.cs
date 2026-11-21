using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.articles;

public class RejectArticleDto
{
    [Required(ErrorMessage = "Комментарий обязателен")]
    [MaxLength(2000, ErrorMessage = "Комментарий не может быть длиннее 2000 символов")]
    public string Comment { get; set; } = string.Empty;
}