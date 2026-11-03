using Application.DTOs.auth.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.schema;

public class TestClass : DefaultResponseDTO<TokensAcReDto>
{

    public TestClass()
    {
        StatusCode = 402;
        Message = "Some";
    }


}
