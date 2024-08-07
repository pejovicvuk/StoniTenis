using StoniTenis.Models.Services;
using System.Security.Claims;

namespace StoniTenis.Middleware
{
    public class UserSessionMiddleware
    {
        private readonly RequestDelegate _next;

        public UserSessionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, KorisnikService korisnikService)
        {
            if (context.User.Identity.IsAuthenticated && !context.Session.GetInt32("KorisnikID").HasValue)
            {
                // Assuming SetSessionID is refactored to be static or you find a way to call it
                await SetSessionID(context, korisnikService);
            }

            // Call the next delegate/middleware in the pipeline
            await _next(context);
        }

        public static async Task SetSessionID(HttpContext context, KorisnikService korisnikService)
        {
            var userClaims = context.User.Identities.First().Claims;
            var email = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (email != null)
            {
                try
                {
                    int userId = await korisnikService.ReturnIdAsync(email);
                    context.Session.SetInt32("KorisnikID", userId);
                    // Optionally set other session values here
                }
                catch (Exception ex)
                {
                    // Handle exceptions, possibly log them
                }
            }
        }
    }
}
