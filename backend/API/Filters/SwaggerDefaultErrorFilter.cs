using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

using Application.DTOs.schema.HTTP_Response;

namespace Infrastructure.Persistence.Filters;

public class SwaggerDefaultErrorFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        // Генерируем схему вашего DefaultErrorDto для Swagger
        var errorSchema = context.SchemaGenerator.GenerateSchema(typeof(ErrorResponse), context.SchemaRepository);

        var mediaType = new OpenApiMediaType { Schema = errorSchema };

        // Стандартные ошибки, которые могут быть у любого эндпоинта
        var errorCodes = new[] { "400", "500" };

        foreach (var code in errorCodes)
        {
            if (!operation.Responses.ContainsKey(code))
            {
                operation.Responses.Add(code, new OpenApiResponse
                {
                    Description = GetDescriptionForCode(code),
                    Content = { ["application/json"] = mediaType }
                });
            }
        }

        // Добавляем 401 только если на эндпоинте или контроллере есть атрибут [Authorize]
        var hasAuthorize = context.MethodInfo.DeclaringType.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any() ||
                           context.MethodInfo.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any();

        if (hasAuthorize && !operation.Responses.ContainsKey("401"))
        {
            operation.Responses.Add("401", new OpenApiResponse
            {
                Description = "Не авторизован",
                Content = { ["application/json"] = mediaType }
            });
        }
    }

    private string GetDescriptionForCode(string code) => code switch
    {
        "400" => "Неверный запрос (ошибка валидации или бизнес-логики)",
        "500" => "Внутренняя ошибка сервера",
        _ => "Ошибка"
    };
}


