
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

<<<<<<< HEAD
        // Первичный ключ
=======

        // If UserRole needs save to string not int
        // Now it saving into int;
        // #INT ROLES
        //builder.Property(u => u.Role)
        //       .HasConversion<string>();

        // id | uuid | PK
>>>>>>> 7158d40a8816a1df1f66a34e3046ba68040d7f05
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .HasColumnType("uuid");


        builder.Property(u => u.Email)
            .HasMaxLength(255)
            .IsRequired()
            .HasComment("Храним в нижнем регистре");

        builder.HasIndex(u => u.Email)
            .IsUnique();


        builder.Property(u => u.PasswordHash)
            .HasMaxLength(255)
            .IsRequired()
            .HasComment("Хеш, не пароль");

 
        builder.Property(u => u.DisplayName)
            .HasMaxLength(100)
            .IsRequired()
            .HasComment("Имя для шапки");


        builder.Property(u => u.CreatedAt)
            .HasColumnType("timestamptz")
            .IsRequired();

  
        builder.Property(u => u.Role)
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired()
            .HasDefaultValue(UserRole.Journalist)
            .HasSentinel(UserRole.Journalist)
            .HasComment("Роль пользователя");
    }
}