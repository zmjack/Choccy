using System.Diagnostics.CodeAnalysis;

namespace ChoccyAdmin.Server.Design;

public class ReactRouteAttribute : Attribute
{
    public ReactRouteAttribute([StringSyntax("Route")] string template)
    {
        Template = template ?? throw new ArgumentNullException(nameof(template));
    }

    /// <inheritdoc />
    [StringSyntax("Route")]
    public string Template { get; }
}
