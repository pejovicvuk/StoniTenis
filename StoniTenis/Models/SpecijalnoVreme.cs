using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoniTenis.Models
{
    [PrimaryKey(nameof(Datum), nameof(LokalID))]
    public class SpecijalnoVreme
    {
        public DateOnly Datum { get; set; }

        [ForeignKey("Lokal")]
        public int LokalID { get; set; }

        public TimeOnly VremeOtvaranja { get; set; }

        public TimeOnly VremeZatvaranja { get; set; }

        public virtual Lokal Lokal { get; set; }
    }
}
