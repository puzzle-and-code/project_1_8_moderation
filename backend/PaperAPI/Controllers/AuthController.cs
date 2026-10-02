using Microsoft.AspNetCore.Mvc;
using Paper.Application.DTOs.Auth;
using Paper.Application.DTOs.Auth.Out;
using Paper.Domain.Models.User;
using Paper.Domain.Test_timely.UserFilter;
using Paper.Domain.Test_timely.UserManager;

namespace PaperAPI.Controllers;



[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{

    private UserManager _manager = new();


    [HttpPost("register")]
    [ProducesResponseType(typeof(SignUpUserDto), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(409)]
    //public async Task<IActionResult> Register([FromBody] SignUpUserDto userData)
    public IActionResult Register([FromBody] SignUpUserDto userData)
    {
        // Прверка на атрибуты
        // Example: [Requared] [Range] и т. д. 
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        UserFilterTake take = new()
        {
            Email = userData.Email,
        };

        UserInfo? user = _manager.GetUser(take);

        // есть пользватель с такой почтой
        if (user != null)
        {
            //return Conflict("Неверный логин или пароль");
            return Conflict("Есть такой пользователь");
        }

        int userId = _manager.AddUser(userData.Email, userData.Password);
        _manager.SynsSaveData();

        return Ok(new AuthCreated
        {
            Id = userId,
            Message = "Added new User."
        });
    }


    [HttpPost("SignIn")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]

    // Тута нету асинхронности пока что...
    //public async Task<IActionResult> Login([FromBody] SignInUserDto userData)
    public IActionResult Login([FromBody] SignInUserDto userData)
    {
        // Прверка на атрибуты
        // Example: [Requared] [Range] и т. д. 
        if (!ModelState.IsValid)
            return BadRequest(ModelState);


        //PS: так как я юзаю не БД, я взял старый скрипт и прописал новый, managers => всего лишь чекает файлы и записывает и вычитывает .json
        // UserManager юзает JsonManager, он хранит Users ввиде List<UserInfo> может выдать пользователя и создавать их,
        // но при этом нужно сохранится после создания, 

        // берем пользователя через Email
        UserFilterTake take = new()
        {
            Email = userData.Email,
        };
        //take.Email = userData.Email;

        // Проходимся по массиву и находим пользователя
        UserInfo? user = _manager.GetUser(take);

        // Не нашли пользвателя
        if (user == null)
        {
            return Unauthorized("Неверный логин или пароль");
        }

        // пароль не совпал
        if (user.Password != userData.Password)
        {
            return Unauthorized("Неверный логин или пароль");
        }


        // Всё ок
        return Ok(new AuthResponse
        {
            Message = "It's Signed In"
        });

    }
}
