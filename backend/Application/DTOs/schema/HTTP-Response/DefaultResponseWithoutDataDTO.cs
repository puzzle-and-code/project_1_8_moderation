using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.schema.HTTP_Response;

public class DefaultResponseWithoutDataDTO
{
    // потом сделаю наверное через Enum или библеотеки
    public virtual int StatusCode { get; set; } = 404;

    // Ответ для СМС, хех
    public virtual string Message { get; set; } = string.Empty;


    public static DefaultResponseWithoutDataDTO Response(int statusCode = 404, string message = "AAA")
    {
        return new DefaultResponseWithoutDataDTO
        {
            StatusCode = statusCode,
            Message = message
        };
    }

}
