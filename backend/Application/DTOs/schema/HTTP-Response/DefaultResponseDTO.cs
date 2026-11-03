using Application.DTOs.auth.Tokens;
using Application.DTOs.schema.HTTP_Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.schema;

public class DefaultResponseDTO<T>
{

    // потом сделаю наверное через Enum или библеотеки
    public virtual int StatusCode { get; set; } = 404;

    // Ответ для СМС, хех
    public virtual string Message { get; set; } = string.Empty;


    // Conatiner Ответ основной
    // обычно например JWT Tokens
    public T? Data { get; set; } = default;


    public static DefaultResponseDTO<T> Success(T Data, string message = "Ok", int statusCode = 200)
    {
        return new()
        {
            StatusCode = statusCode,
            Message = message,
            Data = Data
        };
    }

    public static DefaultResponseDTO<TokensAcReDto> Token(TokensAcReDto tokens, int statusCode = 200)
    {
        return new()
        {
            StatusCode = statusCode,
            Message = "JWT Get Gate",
            Data = tokens
        };
    }


}
