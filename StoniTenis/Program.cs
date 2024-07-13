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
});


// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddScoped<ConnectionService>(provider =>
    new ConnectionService(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddTransient<KorisnikService>();
builder.Services.AddTransient<ReservationService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
