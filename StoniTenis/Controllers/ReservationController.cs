using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public IActionResult Reservation()
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
