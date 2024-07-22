﻿using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using StoniTenis.Models.Services;
using Microsoft.AspNetCore.Authorization;
using StoniTenis.Models.Entities;
using System.Data.SqlClient;

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
            await SetSessionID();
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

            await SetSessionID();

            if (!_korisnikService.KorisnikPostoji(email))
            {
                await _korisnikService.InsertKorisnikAsync(name, surname, email, false);
            }

            return RedirectToAction("Nalog");
        }

        private async Task SetSessionID()
        {
            if (User?.Identities.FirstOrDefault()?.IsAuthenticated == true && !HttpContext.Session.TryGetValue("KorisnikID", out _))
            {
                var userClaims = User.Identities.First().Claims;
                var email = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
                if (email != null)
                {
                    try
                    {
                        HttpContext.Session.SetInt32("KorisnikID", await _korisnikService.ReturnIdAsync(email));
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
        }
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Login");
        }

        public async Task<IActionResult> MojiLokali()
        {
            await SetSessionID();
            var lokali = new List<Lokal>();
            await foreach (Lokal lokal in _korisnikService.PopuniMojeLokaleAsync(HttpContext.Session.GetInt32("KorisnikID") ?? default(int)))
            {
                lokali.Add(lokal);
            }
            var klubovi = new List<Klub>();
            await foreach (Klub klub in _korisnikService.PopuniMojeKluboveAsync(HttpContext.Session.GetInt32("KorisnikID") ?? default(int)))
            {
                klubovi.Add(klub);
            }
            ViewBag.Klubovi = klubovi;
            return View(lokali);
        }

        public IActionResult Dashboard(int id)
        {
            var model = new Lokal
            {
                Id = id,
            };

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> AddLokal(Lokal model)
        {
            await _korisnikService.InsertLokalAsync(model.KlubID, model.Adresa, model.Opstina, model.Grad);
            return View("Nalog");
        }
    }
}