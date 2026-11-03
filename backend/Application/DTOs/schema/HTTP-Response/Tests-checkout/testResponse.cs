using Application.DTOs.auth.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.schema;

public class testResponse
{

    DefaultResponseDTO<TokensAcReDto> Test1()
    {
        ///some code


        DefaultResponseDTO<TokensAcReDto> response = new();

        response.Data.AccessToken = "token Access";
        response.Data.RefreshToken = "token Refresh";


        return response;

    }


    DefaultResponseDTO<TokensAcReDto> Test2()
    {
        ///some code


        DefaultResponseDTO<TokensAcReDto> response = new();
        TokensAcReDto tokens = new()
        {
            AccessToken = "AAAAA",
            RefreshToken = "BBBB"
        };

        response.Data = tokens;

        return response;


    }


    TestClass GetSome()
    {
        TestClass testClass = new TestClass();
        TokensAcReDto tokens = new()
        {
            AccessToken = "AAAAA",
            RefreshToken = "BBBB"
        };

        testClass.Data = tokens;

        return testClass;
    }

}
