using ChoccyAdmin.Server.Design;
using Microsoft.AspNetCore.Mvc;
using TypeSharp;

namespace ChoccyAdmin.Server.Controllers;

[ApiController]
[ReactRoute("/c2/weather-1")]
[Route("api/[controller]")]
[TypeScriptGenerator]
public class WeatherForecast4Controller : ControllerBase, IWebPage<string>
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecast4Controller(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public WeatherForecast[] Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        }).ToArray();
    }

    public string Index()
    {
        throw new NotImplementedException();
    }
}
