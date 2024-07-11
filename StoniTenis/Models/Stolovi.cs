using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoniTenis.Models
{
    public class Stolovi
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Lokal")]
        public int LokalID { get; set; }

        public int BrojStola { get; set; }

        public virtual Lokal Lokal { get; set; }

        public virtual ICollection<GrupneRezervacije> GrupneRezervacije { get; set; }
    }
}
