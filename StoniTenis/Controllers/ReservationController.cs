using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor.Compilation;
using StoniTenis.Models.Entities;
using StoniTenis.Models.Services;
using System.Data.SqlClient;

namespace StoniTenis.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : Controller
    {
        private readonly ReservationService _reservationService;

        public ReservationController(ReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpGet("lokal")]
        public IActionResult Lokal()
        {
            return View();
        }

        [Authorize]
        [HttpGet("vreme")]
        public IActionResult Vreme()
        {
            return View();
        }

        [HttpGet("get-reservations")]
        public JsonResult GetReservations()
        {
            var lokali = _reservationService.PopuniLokale();
            return Json(lokali);
        }
    }
}
