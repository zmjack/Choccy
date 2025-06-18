using System.Security.Claims;

namespace ChoccyAdmin.Server.Extensions;

public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// Gets roles of the specified ClaimsPrincipal.
    /// </summary>
    /// <param name="this"></param>
    /// <param name="authenticationType">If null, then use the default authenticationType.</param>
    /// <returns></returns>
    public static string GetName(this ClaimsPrincipal @this, string authenticationType = null)
    {
        ClaimsIdentity identity;
        if (authenticationType != null)
            identity = @this.Identities.FirstOrDefault(x => x.AuthenticationType == authenticationType);
        else identity = @this.Identity as ClaimsIdentity;

        if (identity != null)
            return identity.GetName();
        else return null;
    }

    /// <summary>
    /// Gets roles of the specified ClaimsPrincipal.
    /// </summary>
    /// <param name="this"></param>
    /// <param name="authenticationType">If null, then use the default authenticationType.</param>
    /// <returns></returns>
    public static IEnumerable<string> GetRoles(this ClaimsPrincipal @this, string authenticationType = null)
    {
        ClaimsIdentity identity;
        if (authenticationType != null)
            identity = @this.Identities.FirstOrDefault(x => x.AuthenticationType == authenticationType);
        else identity = @this.Identity as ClaimsIdentity;

        if (identity != null)
            return identity.GetRoles();
        else return Array.Empty<string>();
    }

    /// <summary>
    /// Gets ID of the specified ClaimsPrincipal.
    /// </summary>
    /// <param name="this"></param>
    /// <param name="authenticationType">If null, then use the default authenticationType.</param>
    /// <returns></returns>
    public static string GetId(this ClaimsPrincipal @this, string authenticationType = null) => @this.GetClaim(authenticationType, ClaimTypes.NameIdentifier);

    /// <summary>
    /// Gets claims of the specified cliam type of the specified ClaimsPrincipal.
    /// </summary>
    /// <param name="this"></param>
    /// <param name="authenticationType">If null, then use the default authenticationType.</param>
    /// <param name="claimType"></param>
    /// <returns></returns>
    public static IEnumerable<string> GetClaims(this ClaimsPrincipal @this, string authenticationType, string claimType)
    {
        ClaimsIdentity identity;
        if (authenticationType != null)
            identity = @this.Identities.FirstOrDefault(x => x.AuthenticationType == authenticationType);
        else identity = @this.Identity as ClaimsIdentity;

        if (identity != null)
            return identity.GetClaims(claimType);
        else return Array.Empty<string>();
    }
    /// <summary>
    /// Gets the first claim of the specified cliam type of the specified ClaimsPrincipal.
    /// </summary>
    /// <param name="this"></param>
    /// <param name="authenticationType">If null, then use the default authenticationType.</param>
    /// <param name="claimType"></param>
    /// <returns></returns>
    public static string GetClaim(this ClaimsPrincipal @this, string authenticationType, string claimType) => @this.GetClaims(authenticationType, claimType).FirstOrDefault();

}
