using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StoniTenis.Models.Entities;
using StoniTenis.Models.Services;

namespace StoniTenis.Controllers
{
    public class DashboardController : Controller
    {
        private readonly KorisnikService _korisnikService;

        public DashboardController(KorisnikService korisnikService)
        {
            _korisnikService = korisnikService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> MojiLokali()
        {
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
        public async Task AddLokal(Lokal model)
        {
            await _korisnikService.InsertLokalAsync(model.KlubID, model.Adresa, model.Opstina, model.Grad);
            //return View("~/Views/Home/Index"); //ovo je test, promeni ovo
        }
    }
}
