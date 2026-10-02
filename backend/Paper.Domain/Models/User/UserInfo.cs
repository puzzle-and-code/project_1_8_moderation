
using System.ComponentModel.DataAnnotations;


namespace Paper.Domain.Models.User;

public class UserInfo
{

    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Email { get; set; }


    [Required]
    [MaxLength(100)]
    public string Password { get; set; }
    //public string PasswordHash { get; set; }






}
