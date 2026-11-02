using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Interfaces;

public interface IAppDbContext
{

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
