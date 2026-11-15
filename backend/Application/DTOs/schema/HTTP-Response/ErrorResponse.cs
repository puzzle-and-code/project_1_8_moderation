using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.schema.HTTP_Response;

public class ErrorResponse
{

    public int StatusCode { get; set; } = 400;

    public string Message { get; set; } = string.Empty;



}
