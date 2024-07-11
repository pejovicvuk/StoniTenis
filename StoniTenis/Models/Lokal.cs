using Microsoft.AspNetCore.Connections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoniTenis.Models
{
    public class Lokal
    {
        [Key]
        public int Id { get; set; }

        public string Adresa { get; set; }

        public DateOnly KrajRezervacija { get; set; }

        [ForeignKey("Klub")]
        public int KlubID { get; set; }

        public virtual Klub Klub { get; set; }

        public virtual ICollection<RadnoVreme> RadnaVremena { get; set; }
    }
}
