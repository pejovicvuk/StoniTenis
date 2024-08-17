﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor.Compilation;
using StoniTenis.Models.Entities;
using StoniTenis.Models.Services;
using System.Data.SqlClient;

namespace StoniTenis.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReservationController : Controller
    {
        private readonly ReservationService _reservationService;
        private readonly VlasnikService _vlasnikService;

        public ReservationController(ReservationService reservationService, VlasnikService vlasnikService)
        {
            _reservationService = reservationService;
            _vlasnikService = vlasnikService;
        }

        [Authorize]
        [HttpGet("Lokal")]
        public IActionResult Lokal()
        {
            return View();
        }

        [HttpGet("Vreme")]
        public async Task<IActionResult> Vreme(int id)
        {
            var radnoVremeList = new List<RadnoVreme>();

            await foreach (RadnoVreme radnoVreme in _vlasnikService.RadnoVremePrikazi(id))
            {
                radnoVremeList.Add(radnoVreme);
            }
            ViewBag.RadnoVremeLokal = radnoVremeList;

            Rezervacije rezervacija = new Rezervacije();

            return View(rezervacija); 
        }

        [HttpGet("get-lokal")]
        public async Task<List<Lokal>> GetLokalAsync()
        {
            var lokali = new List<Lokal>();

            await foreach (Lokal lokal in _reservationService.PopuniLokaleAsync())
            {
                lokali.Add(lokal);
            }
            return lokali;
        }

        [HttpPost("add-reservation")]
        public async Task AddReservationAsync(Rezervacije model)
        {
            await _reservationService.UnesiRezervacije(model.KorisniciID, model.Pocetak, model.Kraj, model.Datum, model.StalnaRezervacija, model.Zavrseno);
        }

        [HttpGet("get-reservation")]
        public async Task<List<Rezervacije>> GetReservationAsync()
        {
            var rezervacije = new List<Rezervacije>();

            await foreach (Rezervacije rezervacija in _reservationService.PopuniRezervacijeAsync())
            {
                rezervacije.Add(rezervacija);
            }
            return rezervacije;
        }

    }
}
