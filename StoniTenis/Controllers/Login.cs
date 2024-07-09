using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace StoniTenis.Controllers
{
    public class LoginController : Controller  
    {

        public IActionResult Index()
        {
            return View(); 
        }

        public IActionResult LoginWithGoogle()
        {
            var authenticationProperties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("https://localhost:44387/signin-google")
            };
            return Challenge(authenticationProperties, GoogleDefaults.AuthenticationScheme);
        }

        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (result.Succeeded)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }
    }
}
