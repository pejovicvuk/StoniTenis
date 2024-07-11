using Microsoft.EntityFrameworkCore;
using StoniTenis.Models;

namespace StoniTenis.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Korisnik> Korisnici { get; set; }
        public DbSet<Klub> Klubovi { get; set; }
        public DbSet<Lokal> Lokali { get; set; }
        public DbSet<Stolovi> Stolovi { get; set; }
        public DbSet<Rezervacije> Rezervacije { get; set; }
        public DbSet<GrupneRezervacije> GrupneRezervacije { get; set; }
        public DbSet<RadnoVreme> RadnaVremena { get; set; }
        public DbSet<SpecijalnoVreme> SpecijalnaVremena { get; set; }
    }
}
