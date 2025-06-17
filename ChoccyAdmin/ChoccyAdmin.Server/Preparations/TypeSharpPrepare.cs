using Prepare;
using TypeSharp;
using TypeSharp.Resolvers;

namespace ChoccyAdmin.Server.Preparations;

public class TypeSharpPrepare : IDesignTimePrepareFactory
{
    public void Prepare(PrepareProject project, string[] args)
    {
        var sourcePath = Path.Combine(project.ProjectRoot, "..", "choccyadmin.client", "src", "!autogen", "api.ts");
        var parser = new TypeScriptGenerator(new()
        {
            CamelCase = true,
            ModuleCode = ModuleCode.Nested,
            DetectionMode = DetectionMode.AutoDetect,
            IntegrationCodes = [IntegrationCode.HandleResponse_DeclareOnly],
            //IntegrationCodes = [IntegrationCode.SaveFile, IntegrationCode.HandleResponse_DeclareOnly],
            Resolvers =
            [
                new ControllerResolver()
                {
                    DefaultRoute = "[controller]/[action]",
                },
            ],
            //HeaderCode =
            //    """
            //    import { $ts_handle_response, $ts_handle_error } from './ots.api.deps'
            //    """,
        })
        {
        };

        var code = $@"{parser.GetCode()}";
        if (File.Exists(sourcePath))
        {
            var origin = File.ReadAllText(sourcePath);
            if (origin == code)
            {
                Console.WriteLine($"File does not need to be updated.");
                return;
            }
        }

        File.WriteAllText(sourcePath, code);
        Console.WriteLine($"File saved: {sourcePath}");
    }
}
