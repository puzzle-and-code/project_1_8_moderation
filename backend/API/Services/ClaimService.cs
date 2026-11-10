
using Domain.Entities.UnTabled;
using System.Security.Claims;
using Application.Interfaces.Services;

namespace Application.Services;

public class ClaimService(IHttpContextAccessor _httpContextAccessor) : IClaimService
{

    public Guid? GetUserId()
    {
        // Получаем пользователя из текущего HTTP-контекста
        var user = _httpContextAccessor.HttpContext?.User;

        var user_id_string = user?.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(user_id_string, out var userId) ? userId : Guid.Empty;
    }


    public Roles? GetRole()
    {
        // 1. Достаем роль из токена (это всегда строка, например "Admin" или "0")
        var role_str = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

        // 2. Пытаемся безопасно перевести строку
        // ignoreCase: true позволяет проигнорировать регистр (admin == Admin)
        if (Enum.TryParse<Roles>(role_str, true, out var role))
        {
            return role;
        }

        // 3. Если роли в токене нет или там непонятный мусор, возвращаем значение по умолчанию
        //return Roles.DefaultCreated;

        return null;
    }


    public string GetStringRole()
    {
        return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
    }




    public int? GetIntRole()
    {

        // Если нужно изменить
        //var role_str = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

        //if (Enum.TryParse<Roles>(role_str, true, out var role))
        //{
        //    return (int)role;
        //}

        //return null;

        int? id_role = (int?)GetRole();
        return id_role;
    }
}
