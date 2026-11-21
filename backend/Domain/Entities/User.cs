using Domain.Enums;

namespace Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public UserRole Role { get; set; } = UserRole.Journalist;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}