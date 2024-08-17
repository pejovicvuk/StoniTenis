using StoniTenis.Models.Entities;
using System.Data;
using System.Data.SqlClient;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace StoniTenis.Models.Services
{
    public class ReservationService
    {
        private readonly ConnectionService _connectionService;

        public ReservationService(ConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        public async IAsyncEnumerable<Lokal> PopuniLokaleAsync()
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                await conn.OpenAsync();
                string sql = "SELECT Lokal.id, Lokal.adresa, Lokal.opstina, Lokal.grad, Klub.naziv FROM Lokal JOIN Klub ON Lokal.klub_id = Klub.id";
                SqlCommand cmd = new SqlCommand(sql, conn);

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        yield return new Lokal
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("id")),
                            KlubNaziv = reader.GetString(reader.GetOrdinal("naziv")),
                            Adresa = reader.GetString(reader.GetOrdinal("adresa")),
                            Opstina = reader.GetString(reader.GetOrdinal("opstina")),
                            Grad = reader.GetString(reader.GetOrdinal("grad"))
                        };
                    }
                }
            }
        }
        public async IAsyncEnumerable<Rezervacije> PopuniRezervacijeAsync()
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                await conn.OpenAsync();
                string sql = "SELECT * FROM Rezervacije";
                SqlCommand cmd = new SqlCommand(sql, conn);

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        yield return new Rezervacije
                        {
                            ID = reader.GetInt32(reader.GetOrdinal("id")),
                            KorisniciID = reader.GetInt32(reader.GetOrdinal("korisnici_id")),
                            Pocetak = reader.GetTimeSpan(reader.GetOrdinal("pocetak")),
                            Kraj = reader.GetTimeSpan(reader.GetOrdinal("kraj")),
                            Datum = reader.GetDateTime(reader.GetOrdinal("datum")),
                            StalnaRezervacija = reader.GetBoolean(reader.GetOrdinal("stalna_rezervacija")),
                            Zavrseno = reader.GetBoolean(reader.GetOrdinal("zavrseno")),
                        };
                    }
                }
            }
        }
        public async Task UnesiRezervacije(int korisnikID, TimeSpan pocetak, TimeSpan kraj, DateTime datum, bool stalnaRezervacija, bool zavrseno)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("InsertRezervacija", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Korisnici_id", korisnikID);
                    cmd.Parameters.AddWithValue("@Pocetak", pocetak);
                    cmd.Parameters.AddWithValue("@Kraj", kraj);
                    cmd.Parameters.AddWithValue("@Datum", datum);
                    cmd.Parameters.AddWithValue("@StalnaRezervacija", stalnaRezervacija);
                    cmd.Parameters.AddWithValue("@Zavrseno", zavrseno);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }
    }
}
