namespace StoniTenis.Models.Entities
{
    public class RadnoVreme
    {
        public int DanUNedelji { get; set; }
        public int LokalID { get; set; }
        public TimeOnly VremeOtvaranja { get; set; }
        public TimeOnly VremeZatvaranja { get; set; }
        public DateOnly EfektivanDatum { get; set; }    
    }
}
