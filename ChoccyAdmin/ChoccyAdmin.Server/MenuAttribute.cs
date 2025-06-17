namespace ChoccyAdmin.Server;

[AttributeUsage(AttributeTargets.Class)]
public class MenuAttribute(string[] path) : Attribute
{
    public string[] Path { get; } = path;
}
