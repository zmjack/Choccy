using ChoccyAdmin.Server.Design;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TypeSharp;

namespace ChoccyAdmin.Server.App.Controllers;

[Authorize]
[ApiController]
[ReactRoute("/")]
[Route("api/[controller]")]
[TypeScriptGenerator]
public class HomeController : ControllerBase, IWebPage<HomeController.HomeResponse>
{
    private readonly ILogger<WeatherAdminController> _logger;

    public HomeController(ILogger<WeatherAdminController> logger)
    {
        _logger = logger;
    }

    public class HomeResponse
    {
        public string Name { get; set; }
    }

    [HttpGet]
    public HomeResponse Index()
    {
        return new()
        {
            Name = "Hello Choccy!",
        };
    }
}
