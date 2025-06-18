using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TypeSharp;

namespace ChoccyAdmin.Server.Controllers;

[ApiController]
[AllowAnonymous]
[Route("[controller]/[action]")]
public class AccountController : Controller
{
    public AccountController()
    {
    }

    [TypeScriptGenerator]
    public enum LoginError
    {
        Unknown = 0,
        Fail = 1,
    }

    [HttpGet]
    public IActionResult Login()
    {
        return LocalRedirect("/login");
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromForm] string userName, [FromForm] string password, string? returnUrl = null)
    {
        var claims = new List<Claim>();
        if (userName == "admin")
        {
            claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim(ClaimTypes.Role, "User"),
            };
        }
        else if (userName == "user")
        {
            claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.Role, "User"),
            };
        }
        else
        {
            return LocalRedirect($"/login?err={(int)LoginError.Fail}&returnUrl={returnUrl ?? "/"}");
        }

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties
        {
            //AllowRefresh = <bool>,
            // Refreshing the authentication session should be allowed.

            //ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
            // The time at which the authentication ticket expires. A 
            // value set here overrides the ExpireTimeSpan option of 
            // CookieAuthenticationOptions set with AddCookie.

            //IsPersistent = true,
            // Whether the authentication session is persisted across 
            // multiple requests. When used with cookies, controls
            // whether the cookie's lifetime is absolute (matching the
            // lifetime of the authentication ticket) or session-based.

            //IssuedUtc = <DateTimeOffset>,
            // The time at which the authentication ticket was issued.

            //RedirectUri = <string>
            // The full path or absolute URI to be used as an http 
            // redirect response value.
        };

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity),
            authProperties);

        return LocalRedirect(returnUrl ?? "/");
    }

    [HttpGet]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        return LocalRedirect("/login");
    }
}
