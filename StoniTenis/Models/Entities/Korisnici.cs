namespace StoniTenis.Models.Entities
{
    public class Korisnici
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public bool Vlasnik { get; set; }
        public string Ime { get; set; } 
        public string Prezime { get; set; } 
    }

}
