using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoniTenis.Models
{
    public class Klub
    {
        [Key]
        public int Id { get; set; }

        public string Naziv { get; set; }

        [ForeignKey("Korisnik")]
        public int KorisnikID {  get; set; }

        public virtual Korisnik Korisnik { get; set; }

        public virtual ICollection<Lokal> Lokali { get; set; }
    }
}
