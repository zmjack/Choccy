using Ajax;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TypeSharp;

namespace ChoccyAdmin.Server.Controllers;

/// <summary>
/// JWT 授权控制器
/// </summary>
[ApiController]
[AllowAnonymous]
[TypeScriptGenerator]
[Route("open/api/[controller]/[action]")]
public class JwtController : Controller
{
    public JwtController()
    {
    }

    public class RequestModel
    {
        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string Password { get; set; }
    }

    public class TokenModel
    {
        /// <summary>
        /// 令牌
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// Bearer 授权码
        /// </summary>
        public string Bearer => $"Bearer {Token}";

        /// <summary>
        /// 有效期
        /// </summary>
        public DateTime Expires { get; set; }
    }

    /// <summary>
    /// 获取访问令牌
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost]
    public JSend<TokenModel> GetToken([FromBody] RequestModel model)
    {
        var expires = DateTime.Now.AddMinutes(20);
        var handler = new JwtSecurityTokenHandler();
        var securityToken = new JwtSecurityToken("localhost", "localhost",
            claims: new[]
            {
                new Claim(ClaimTypes.Name, model.UserName),
                new Claim(ClaimTypes.Role, "Admin")
            },
            expires: expires,
            signingCredentials: new SigningCredentials(Program.JwtSecurityKey, SecurityAlgorithms.HmacSha256));

        return JSend.Success(new TokenModel
        {
            Token = handler.WriteToken(securityToken),
            Expires = expires,
        });
    }

    ///// <summary>
    ///// 获取访问令牌
    ///// </summary>
    ///// <param name="model"></param>
    ///// <returns></returns>
    //[HttpPost]
    //public JSend<TokenModel> GetToken([FromBody] RequestModel model)
    //{
    //    var user = _context.Users.FirstOrDefault(x => x.UserName == model.UserName);
    //    if (user == null) return JSend.Error("Invalid username or password.");

    //    var pass = PasswordHasher.VerifyHashedPassword(user.PasswordHash, model.Password);
    //    if (pass == PasswordVerificationResult.Success || pass == PasswordVerificationResult.SuccessRehashNeeded)
    //    {
    //        var userRoleIds = _context.UserRoles.Where(x => x.UserId == user.Id).Select(x => x.RoleId);
    //        var roles = _context.Roles.Where(x => userRoleIds.Contains(x.Id));

    //        var expires = DateTime.Now.AddMinutes(20);
    //        var handler = new JwtSecurityTokenHandler();
    //        var securityToken = new JwtSecurityToken("localhost", "localhost",
    //            claims: new[]
    //            {
    //                new Claim(ClaimTypes.Name, model.UserName)
    //            }.Concat(roles.Select(r => new Claim(ClaimTypes.Role, r.Name))),
    //            expires: expires,
    //            signingCredentials: new SigningCredentials(Program.JwtSecurityKey, SecurityAlgorithms.HmacSha256));

    //        return JSend.Success(new TokenModel
    //        {
    //            Token = handler.WriteToken(securityToken),
    //            Expires = expires,
    //        });
    //    }

    //    return JSend.Error("Invalid username or password.");
    //}

}
