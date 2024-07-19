using Microsoft.AspNetCore.Authorization;
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

        public ReservationController(ReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [Authorize]
        [HttpGet("Lokal")]
        public IActionResult Lokal()
        {
            return View();
        }

        [HttpGet("Vreme")]
        public IActionResult Vreme(int id)
        {
            var model = new Lokal
            {
                Id = id,
            };

            return View(model); 
        }

        [HttpGet("get-reservations")]
        public async Task<List<Lokal>> GetReservationsAsync()
        {
            var lokali = new List<Lokal>();

            await foreach (Lokal lokal in _reservationService.PopuniLokaleAsync())
            {
                lokali.Add(lokal);
            }
            return lokali;
        }

    }
}
