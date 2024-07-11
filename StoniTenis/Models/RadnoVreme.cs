using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoniTenis.Models
{
    public class RadnoVreme
    {
        [Key]
        public int DanUNedelji { get; set; }

        [Key][ForeignKey("Lokal")]
        public int LokalID { get; set; }

        public TimeOnly VremeOtvaranja { get; set; } 

        public TimeOnly VremeZatvaranja { get; set; }

        public DateOnly EfektivanDatum { get; set; }

        public virtual Lokal Lokal { get; set; }
    }
}
