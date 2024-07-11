using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoniTenis.Models
{
    public class Rezervacije
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Korisnik")]
        public int KorisnikID { get; set; }

        public TimeOnly Pocetak { get; set; }

        public TimeOnly Kraj { get; set; }

        public DateOnly Datum { get; set; }

        public bool StalnaRezervacija { get; set; }

        public bool Zavrseno { get; set; }

        public virtual Korisnik Korisnik { get; set; }

        public virtual ICollection<GrupneRezervacije> GrupneRezervacije { get; set; }
    }
}
