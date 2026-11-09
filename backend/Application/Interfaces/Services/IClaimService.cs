using Domain.Entities.UnTabled;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services;

public interface IClaimService
{

    public Guid? GetUserId();


    public Roles? GetRole();

    public string GetStringRole();

    public int? GetIntRole();

}
