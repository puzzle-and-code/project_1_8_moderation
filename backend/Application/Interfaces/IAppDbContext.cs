using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Interfaces;

public interface IAppDbContext
{
    DbSet<User> Users { get; }

    DbSet<RefreshToken> RefreshTokens { get; }

    DbSet<Article> Articles { get; }

    DbSet<ArticleRejectionHistory> ArticleRejectionHistories { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}