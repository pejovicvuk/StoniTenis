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
                await SetSessionID(context, korisnikService);
            }

            await _next(context);
        }
        //razumi invoke async


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
                    context.Session.SetInt32("isVlasnik", Convert.ToInt32(await korisnikService.IsVlasnik(userId)));
                }
                catch (Exception ex)
                {

                }
            }
        }
    }
}
