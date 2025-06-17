using ChoccyAdmin.Server.Design;
using Microsoft.AspNetCore.Mvc;
using TypeSharp;

namespace ChoccyAdmin.Server.Controllers;

[ApiController]
[ReactRoute("/")]
[Route("api/[controller]")]
[TypeScriptGenerator]
public class HomeController : ControllerBase, IWebPage<HomeController.AA>
{
    private readonly ILogger<WeatherForecastController> _logger;

    public HomeController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    public class AA
    {
        public string Name { get; set; }
    }

    [HttpGet]
    public AA Index()
    {
        return new()
        {
            Name = "Home",
        };
    }
}
