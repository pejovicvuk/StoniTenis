using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoniTenis.Models
{
    public class GrupneRezervacije
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Stolovi")]
        public int StoloviID { get; set; }

        [ForeignKey("Rezervacije")]
        public int RezervacijeID { get; set; }

        public virtual Stolovi Sto { get; set; }

        public virtual Rezervacije Rezervacija { get; set; }
    }
}
