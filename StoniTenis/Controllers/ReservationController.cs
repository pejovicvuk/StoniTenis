using Microsoft.AspNetCore.Mvc;
using StoniTenis.Models.Entities;
using StoniTenis.Models.Services;
using System.Data.SqlClient;

namespace StoniTenis.Controllers
{
    public class ReservationController : Controller
    {
        private readonly ReservationService _reservationService;

        public ReservationController(ReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        public IActionResult Reservation()
        {
            var lokali = _reservationService.PopuniLokale();
            return View(lokali);
        }

    }
}
