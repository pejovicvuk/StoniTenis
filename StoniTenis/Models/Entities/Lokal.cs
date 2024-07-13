namespace StoniTenis.Models.Entities
{
    public class Lokal
    {
        public int Id { get; set; }
        public int KlubID { get; set; }
        public DateOnly? kraj_rezervacija { get; set; }
        public string Opstina { get; set; }
        public string Adresa { get; set; }
        public string Lokacija { get; set; }
    }
}
