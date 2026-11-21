using Microsoft.AspNetCore.Mvc;
using Application.DTOs.schema.HTTP_Response;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class FundomentalController : ControllerBase
{
    [NonAction]
    public ActionResult BadRequest(string message)
    {
        return base.BadRequest(new ErrorResponse
        {
            StatusCode = StatusCodes.Status400BadRequest,
            Message = message
        });
    }

    [NonAction]
    public ActionResult Conflict(string message)
    {
        return base.Conflict(new ErrorResponse
        {
            StatusCode = StatusCodes.Status409Conflict,
            Message = message
        });
    }

    [NonAction]
    public ActionResult Unauthorized(string message)
    {
        return base.Unauthorized(new ErrorResponse
        {
            StatusCode = StatusCodes.Status401Unauthorized,
            Message = message
        });
    }


}
