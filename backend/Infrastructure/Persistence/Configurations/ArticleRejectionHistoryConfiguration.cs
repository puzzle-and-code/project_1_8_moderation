using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ArticleRejectionHistoryConfiguration
    : IEntityTypeConfiguration<ArticleRejectionHistory>
{
    public void Configure(EntityTypeBuilder<ArticleRejectionHistory> builder)
    {
        builder.ToTable("article_rejection_history");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.Id)
            .HasColumnType("uuid");

        builder.Property(h => h.ArticleId)
            .HasColumnType("uuid")
            .IsRequired();

        builder.Property(h => h.ModeratorId)
            .HasColumnType("uuid")
            .IsRequired();

        builder.Property(h => h.Comment)
            .HasColumnType("text")
            .IsRequired();

        builder.Property(h => h.CreatedAt)
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.HasOne<Article>()
            .WithMany()
            .HasForeignKey(h => h.ArticleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(h => h.ModeratorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(h => h.ArticleId);

        builder.HasIndex(h => h.ModeratorId);
    }
}