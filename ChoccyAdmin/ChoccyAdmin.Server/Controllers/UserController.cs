using ChoccyAdmin.Server.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TypeSharp;

namespace ChoccyAdmin.Server.Controllers;

[Authorize]
[ApiController]
[TypeScriptGenerator]
[Route("[controller]/[action]")]
public class UserController : Controller
{
    public UserController()
    {
    }

    public class UserProfile
    {
        public required string UserName { get; set; }
        public required string[] Roles { get; set; }
    }

    [HttpGet]
    public UserProfile Profile()
    {
        var roles = User.GetRoles();
        return new()
        {
            UserName = User.Identity?.Name ?? "Unknown",
            Roles = roles.ToArray(),
        };
    }
}
