using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;



[ApiController]
[Route("api/papers")]
public class PapersController : ControllerBase
{


    // Пустит ТОЛЬКО Админа
    [Authorize(Roles = "Admin")]
    [HttpPost("admin-only")]
    public IActionResult AdminAction()
    {
        return Ok("Доступ разрешен только админам");
    }

    [Authorize(Roles = "Journalist")]
    [HttpPost("only-journalist")]
    public IActionResult JournalistAction()
    {
        return Ok("Доступ разрешен создателям контента");
    }


    // Пустит и Админа, и Журналиста (роли перечисляются через запятую без пробелов)
    [Authorize(Roles = "Admin,Moderator,Journalist")]
    [HttpPost("create-paper")]
    public IActionResult CreatePaper()
    {
        return Ok("Доступ разрешен создателям контента");
    }

    // Пустит любого, у кого есть валидный токен (независимо от роли)
    [Authorize]
    [HttpGet("read-paper")]
    public IActionResult ReadPaper()
    {
        return Ok("Доступ разрешен всем авторизованным");
    }


    // Оставляем просто [Authorize], чтобы пустило внутрь метода
    [Authorize]
    [HttpPost("special-action")]
    public IActionResult DoSomethingSpecial()
    {
        // Руками проверяем роль
        if (!User.IsInRole("Admin"))
        {
            // Возвращаем кастомный объект со статусом 403
            return StatusCode(403, new
            {
                errorCode = "ADMIN_REQUIRED",
                details = "Ваша текущая роль не позволяет выполнить это действие."
            });
        }

        return Ok("Всё супер, ты админ!");
    }


    [Authorize]
    [HttpGet("my-profile")]
    public IActionResult GetMyProfile()
    {
        // 1. Получаем ID (тип клейма NameIdentifier)
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Переводим строку в Guid (так как в базе ID хранится как Guid)
        var userId = Guid.Parse(userIdString!);

        // 2. Получаем роль пользователя
        var role = User.FindFirstValue(ClaimTypes.Role);

        // 3. Получаем email
        var email = User.FindFirstValue(ClaimTypes.Email);

        // 4. Получаем кастомный клейм (display_name), который мы задали вручную
        var displayName = User.FindFirstValue("display_name");

        // Пример: передаем полученный userId в сервис
        // await _paperService.GetPapersByAuthorAsync(userId);

        return Ok(new
        {
            Id = userId,
            Role = role,
            Email = email,
            Name = displayName
        });
    }
}
