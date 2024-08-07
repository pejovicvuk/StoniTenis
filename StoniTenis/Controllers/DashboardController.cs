using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StoniTenis.Models.Entities;
using StoniTenis.Models.Services;

namespace StoniTenis.Controllers
{
    public class DashboardController : Controller
    {
        private readonly VlasnikService _vlasnikService;

        public DashboardController(VlasnikService vlasnikService)
        {
            _vlasnikService = vlasnikService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> MojiLokali()
        {
            var lokali = new List<Lokal>();
            await foreach (Lokal lokal in _vlasnikService.PopuniMojeLokaleAsync(HttpContext.Session.GetInt32("KorisnikID") ?? default(int)))
            {
                lokali.Add(lokal);
            }
            var klubovi = new List<Klub>();
            await foreach (Klub klub in _vlasnikService.PopuniMojeKluboveAsync(HttpContext.Session.GetInt32("KorisnikID") ?? default(int)))
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
            ViewBag.LokalID = id;
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> AddLokal(Lokal model)
        {
            await _vlasnikService.InsertLokalAsync(model.KlubID, model.Adresa, model.Opstina, model.Grad);
            return RedirectToAction("MojiLokali");
        }

        [HttpPost]
        public async Task<IActionResult> AddRadnoVreme(RadnoVreme model)
        {
            await _vlasnikService.InsertRadnoVremeAsync(model.DanUNedelji, model.LokalID, model.VremeOtvaranja, model.VremeZatvaranja);
            return View("MojiLokali");
        }
    }
}
