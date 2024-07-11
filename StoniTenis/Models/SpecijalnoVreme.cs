using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoniTenis.Models
{
    public class SpecijalnoVreme
    {
        [Key]
        public DateOnly datum { get; set; }

        [Key][ForeignKey("Lokal")]
        public int LokalID { get; set; }

        public TimeOnly VremeOtvaranja { get; set; }

        public TimeOnly VremeZatvaranja { get; set; }

        public virtual Lokal Lokal { get; set; }
    }
}
