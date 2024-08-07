using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using StoniTenis.Models.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; 
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
{
    var clientId = builder.Configuration["Authentication:Google:ClientId"];
    var clientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

    options.ClientId = clientId;
    options.ClientSecret = clientSecret;
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");
});


// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<ConnectionService>(provider =>
    new ConnectionService(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddTransient<KorisnikService>();
builder.Services.AddTransient<VlasnikService>();
builder.Services.AddTransient<ReservationService>();

builder.Services.AddDistributedMemoryCache(); // Required for session
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Sets the session timeout.
    options.Cookie.HttpOnly = true; // Prevents the session cookie from being accessed by client-side scripts.
    options.Cookie.IsEssential = true; // Marks the session cookie as essential for the application to function correctly.
});

// Build the application.
var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession(); // Make sure this is before UseAuthentication and UseAuthorization

app.UseAuthentication(); // If you have authentication middleware
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();