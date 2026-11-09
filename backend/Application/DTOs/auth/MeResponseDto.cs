using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs.auth;

public class MeResponseDto
{


    [JsonPropertyName("user_id")]
    public Guid? UserId { get; set; } = Guid.Empty;

    public string? Email { get; set; } = string.Empty;

    [JsonPropertyName("display_name")]
    public string? Name { get; set; } = string.Empty;


}
