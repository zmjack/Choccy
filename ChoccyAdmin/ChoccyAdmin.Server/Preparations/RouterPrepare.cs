using ChoccyAdmin.Server.Design;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NStandard;
using Prepare;
using System.Reflection;

namespace ChoccyAdmin.Server.Preparations;

public class RouterPrepare : IDesignTimePrepareFactory
{
    public class Binding
    {
        public required string Path { get; set; }
        public required string Access { get; set; }
    }

    public class ReactRouteObject
    {
        public required string Path { get; set; }
        public required string FullPath { get; set; }
        public required string? Order { get; set; }
        public string? Element { get; set; }
        public string? Access { get; set; }
        public required List<ReactRouteObject> Children { get; set; }
    }

    static ReactRouteObject GetRootObject(IEnumerable<Binding> bindings)
    {
        var root = new ReactRouteObject
        {
            Path = "/",
            FullPath = "",
            Element = "<App />",
            Order = null,
            Children = [],
        };

        foreach (var binding in bindings)
        {
            var parts = binding.Path.TrimStart('/').Split('/');
            BuildCore(binding, new Queue<string>(parts), root);
        }

        return root;
    }

    static void BuildCore(Binding binding, Queue<string> parts, ReactRouteObject root)
    {
        if (parts.Count == 0) return;

        var node = parts.Dequeue();
        var exist = root.Children.FirstOrDefault(c => c.Path == node);
        if (exist is not null)
        {
            BuildCore(binding, parts, exist);
        }
        else
        {
            var fullPath = $"{root.FullPath}/{node}";
            var config = $"config['{fullPath}']";
            var child = new ReactRouteObject()
            {
                Path = node,
                FullPath = fullPath,
                Order = $"{config}.order",
                Children = [],
            };
            root.Children.Add(child);

            if (parts.Count == 0)
            {
                child.Access = binding.Access;
                child.Element = $"{config}.element";
            }
            else
            {
                BuildCore(binding, parts, child);
            }
        }
    }

    public void Prepare(PrepareProject project, string[] args)
    {
        var sourcePath = Path.Combine(project.ProjectRoot, "..", "choccyadmin.client", "src", "!autogen", "Router.tsx");

        var pageControllers = Assembly.GetExecutingAssembly().GetTypesWhichImplements(typeof(IWebPage<>));
        var accesses = new List<Binding>();
        foreach (var controller in pageControllers)
        {
            var route = controller.GetCustomAttribute<ReactRouteAttribute>();
            var authorize = controller.GetCustomAttribute<AuthorizeAttribute>();
            if (route is not null)
            {
                var template = route.Template;
                var controllerName = controller.Name.TrimEnd("Controller");
                var access = new Binding()
                {
                    Path = template.Replace("[controller]", controllerName),
                    Access = authorize is not null
                        ? authorize.Policy ?? authorize.Roles ?? "default"
                        : "default",
                };
                accesses.Add(access);
            }
        }

        var root = GetRootObject(accesses);
        IEnumerable<ReactRouteObject> IterateReactRouteObjects(ReactRouteObject route)
        {
            yield return route;
            foreach (var child in route.Children)
            {
                foreach (var subChild in IterateReactRouteObjects(child))
                {
                    yield return subChild;
                }
            }
        }
        IEnumerable<ReactRouteObject> AllReactRouteObjects(ReactRouteObject route)
        {
            foreach (var child in route.Children)
            {
                foreach (var subChild in IterateReactRouteObjects(child))
                {
                    yield return subChild;
                }
            }
        }

        string CodeRoutes(ReactRouteObject route, Indent indent)
        {
            return $@"{{
{indent + 1}path: '{route.Path}'{(route.Order is not null ?
    $",\r\n{indent + 1}order: {route.Order}" : "")}{(route.Element is not null ?
    $",\r\n{indent + 1}element: {route.Element}" : "")}{(route.Access is not null ?
    $",\r\n{indent + 1}access: '{route.Access}'" : "")}{(route.Children.Any() ?
    $",\r\n{indent + 1}children: [{route.Children.Select(x => CodeRoutes(x, indent + 1)).Join(", ")}].sort(sort)" : "")}
{indent}}}";
        }

        var code = $@"import App from '../App'
import {{ ReactNode }} from ""react"";
import {{ RouteObject }} from ""react-router-dom"";

export type RouterItem = {{
  label: string,
  icon?: ReactNode,
  element?: ReactNode,
  order?: number,
}}
export type RouterConfig = {{{(from r in AllReactRouteObjects(root) select $"\r\n  '{r.FullPath}': RouterItem").Join(",")}
}} & Record<string, RouterItem>;

type Item = RouteObject & {{ order?: number }};

export function getRoutes(config: RouterConfig): Item[] {{
  function sort(a: Item, b: Item): number {{
    return a.order! - b.order!;
  }}
  return [{CodeRoutes(root, new Indent(1, 2))}]
}};

export function createRouterConfig(config: RouterConfig): RouterConfig {{
  const keys = Object.keys(config);
  let i = 0;
  for (let key of keys) {{
    config[key].order = i++;
  }}
  return config;
}}
";
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
