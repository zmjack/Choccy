using Microsoft.AspNetCore.Identity;

namespace ChoccyAdmin.Server.Design;

public static class PasswordHasher
{
    private static readonly PasswordHasher<object> Hasher = new PasswordHasher<object>();

    public static string HashPassword(string password) => Hasher.HashPassword(null, password);
    public static PasswordVerificationResult VerifyHashedPassword(string hashedPassword, string providedPassword)
    {
        return Hasher.VerifyHashedPassword(null, hashedPassword, providedPassword);
    }
}
