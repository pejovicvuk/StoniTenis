namespace StoniTenis.Models.Entities
{
    public class Rezervacije
    {
        public int ID { get; set; }
        public int KorisniciID { get; set; }
        public TimeSpan Pocetak { get; set; }
        public TimeSpan Kraj { get; set; }
        public DateTime Datum { get; set; }
        public bool StalnaRezervacija { get; set; }
        public bool Zavrseno { get; set; }
    }
}
