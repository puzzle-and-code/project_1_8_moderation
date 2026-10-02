
using System.ComponentModel.DataAnnotations;

namespace Paper.Application.DTOs.Auth;

public class SignUpUserDto
{

    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }



}
