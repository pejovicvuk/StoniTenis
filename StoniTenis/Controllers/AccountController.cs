﻿using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using StoniTenis.Models.Services;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<IActionResult> Nalog()
        {
            SetSessionID();
            return View();
        }

        public IActionResult PostaniVlasnik()
        {
            _korisnikService.PostaniVlasnik(HttpContext.Session.GetInt32("KorisnikID") ?? default(int));
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

            SetSessionID();

            if (!_korisnikService.KorisnikPostoji(email))
            {
                _korisnikService.InsertKorisnik(name, surname, email, false);
            }

            return RedirectToAction("Nalog");
        }

        private async void SetSessionID()
        {
            if (!HttpContext.Session.TryGetValue("KorisnikID", out _))
            {
                var userClaims = User?.Identities.FirstOrDefault()?.Claims;
                var email = userClaims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
                if (email != null)
                {
                    HttpContext.Session.SetInt32("KorisnikID", await _korisnikService.ReturnIdAsync(email));
                }
            }
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Login");
        }
    }
}
