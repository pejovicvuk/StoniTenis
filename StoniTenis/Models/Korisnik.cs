using System.ComponentModel.DataAnnotations;

namespace StoniTenis.Models
{
    public class Korisnik
    {
        [Key]
        public int Id { get; set; }

        public bool Vlasnik { get; set; }

        public string Ime { get; set; }

        public string Prezime { get; set; }

        public virtual ICollection<Klub> Klubovi { get; set; }

        public virtual ICollection<Rezervacije> Rezervacije { get; set; }
    }
}
