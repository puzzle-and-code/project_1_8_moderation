using Application.DependencyInjections;
using Infrastructure.Authentication;
using Infrastructure.DependencyInjections;
<<<<<<< HEAD
using Infrastructure.Persistence;
=======
using Infrastructure.Persistence; // Для AppDbContext при авто-миграции
using Infrastructure.Persistence.Filters;
>>>>>>> 7158d40a8816a1df1f66a34e3046ba68040d7f05
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

<<<<<<< HEAD

builder.Services.AddControllers();

=======
// 1. Подключаем контроллеры (DataAnnotations на DTO будут валидироваться автоматически)
builder.Services.AddControllers();
>>>>>>> 7158d40a8816a1df1f66a34e3046ba68040d7f05
builder.Services.AddApplication();


builder.Services.AddInfrastructure(builder.Configuration);


var jwtOptions = builder.Configuration
    .GetSection(JwtOptions.SectionName)
    .Get<JwtOptions>()
    ?? throw new InvalidOperationException(
        "Секция JWT не найдена в конфигурации.");


if (string.IsNullOrWhiteSpace(jwtOptions.SecretKey))
{
    throw new InvalidOperationException(
        "JWT SecretKey не задан в конфигурации.");
}


builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtOptions.SecretKey)),

            // Указываем, какой Claim отвечает за роль пользователя
            RoleClaimType = ClaimTypes.Role,

            ClockSkew = TimeSpan.Zero
        };
    });


builder.Services.AddAuthorization();


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Project API",
        Version = "v1",
        Description = "Backend API на .NET 8"
    });


    options.OperationFilter<SwaggerDefaultErrorFilter>();


    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Введите ваш JWT токен."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using var scope = app.Services.CreateScope();
<<<<<<< HEAD

    var dbContext = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await dbContext.Database.MigrateAsync();
=======
    var DateBaseContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DateBaseContext.Database.MigrateAsync();
>>>>>>> 7158d40a8816a1df1f66a34e3046ba68040d7f05
}

app.UseHttpsRedirection();

app.UseCors();

<<<<<<< HEAD

=======
// Важен порядок: 
// Сначала UseAuthentication (кто ты?),
>>>>>>> 7158d40a8816a1df1f66a34e3046ba68040d7f05
app.UseAuthentication();

// Затем UseAuthorization (что тебе можно?)
app.UseAuthorization();

app.MapControllers();

await app.RunAsync();