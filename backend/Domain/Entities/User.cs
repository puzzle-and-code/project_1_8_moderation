using Domain.Entities.UnTabled;

namespace Domain.Entities;

public class User
{
    /// <summary>
    /// Guid, simple to mind it is mean => hard mode integer
    /// </summary>
    // Not a 0, 1, 2, 3 -> asddad-adsdsadas-adsads-1223
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// User Role
    /// Need to check and saving who is who.
    /// </summary>
    // Default Created => when created using a JOURNALIST, mb if we can use GUEST role we can change DefaultCreated = 3
    public Roles Role { get; set; } = Roles.DefaultCreated;
    

    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Навигационное свойство: список всех refresh-токенов пользователя
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}