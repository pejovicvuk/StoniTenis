namespace StoniTenis.Models.Entities
{
    public class RadnoVreme
    {
        public int DanUNedelji { get; set; }
        public int LokalID { get; set; }
        public TimeSpan VremeOtvaranja { get; set; }
        public TimeSpan VremeZatvaranja { get; set; }
        public DateTime EfektivanDatum { get; set; }    
    }
}
