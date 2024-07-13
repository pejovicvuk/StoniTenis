using Microsoft.AspNetCore.Mvc;

namespace StoniTenisAPI.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class RezervacijeApiController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}
