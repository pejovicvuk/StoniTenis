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
            if (lokali == null || !lokali.Any())
            {
                // Handle the case where no locations are available
                // Could also consider returning a view with a specific message
                return View("Error", "No locations found");
            }
            return View("~/Views/Account/Reservation.cshtml", lokali);
        }

    }
}
