using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Interfaces;

public interface IAppDbContext
{
    DbSet<User> Users { get; }

    DbSet<RefreshToken> RefreshTokens { get; }

    DbSet<Article> Articles { get; }

    DbSet<ArticleRejectionHistory> ArticleRejectionHistories { get; }


    /// <summary>
    /// User Table
    /// </summary>
    DbSet<User> Users { get; }
    
    /// <summary>
    /// Refresh Tokens Table
    /// </summary>
    DbSet<RefreshToken> RefreshTokens { get; }
    
    /// <summary>
    /// Artivles Table
    /// </summary>
    DbSet<Article> Articles { get; }


    /// <summary>
    /// Save changes its nit added??? WARN
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}