using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using StoniTenis.Models.Services;
using Microsoft.AspNetCore.Authorization;
using StoniTenis.Models.Entities;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using StoniTenis.Middleware;

namespace StoniTenis.Controllers
{
    public class AccountController : Controller
    {
        private readonly KorisnikService _korisnikService;

        public AccountController(KorisnikService korisnikService)
        {
            _korisnikService = korisnikService;
        }

        public IActionResult Login()
        {
            return View();
        }

        [Authorize]
        public IActionResult Nalog()
        {
            return View();
        }

        public async Task<IActionResult> PostaniVlasnik()
        {
            await _korisnikService.PostaniVlasnik(HttpContext.Session.GetInt32("KorisnikID") ?? default(int));
            return View("Nalog");
        }

        public async Task LoginWithGoogle()
        {
            await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme, new AuthenticationProperties()
            {
                RedirectUri = Url.Action("GoogleResponse")
            });
        }

        public async Task<IActionResult> GoogleResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
                return BadRequest("Failed to authenticate.");

            var userClaims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
            if (userClaims == null)
                return BadRequest("No claims found.");

            var name = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value;
            var surname = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value;
            var email = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            await UserSessionMiddleware.SetSessionID(HttpContext, _korisnikService);

            if (!_korisnikService.KorisnikPostoji(email))
            {
                await _korisnikService.InsertKorisnikAsync(name, surname, email, false);
            }

            return RedirectToAction("Nalog");
        }
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Login");
        }
    }
}