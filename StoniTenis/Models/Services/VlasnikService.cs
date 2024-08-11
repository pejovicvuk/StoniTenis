using Microsoft.AspNetCore.Mvc;
using StoniTenis.Models.Entities;
using System.Data;
using System.Data.SqlClient;


namespace StoniTenis.Models.Services
{
    public class VlasnikService
    {
        private readonly ConnectionService _connectionService;

        public VlasnikService(ConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        public async Task InsertLokalAsync(int klub_id, string adresa, string opstina, string grad)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("InsertLokal", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@klub_id", klub_id);
                    cmd.Parameters.AddWithValue("@adresa", adresa);
                    cmd.Parameters.AddWithValue("@opstina", opstina);
                    cmd.Parameters.AddWithValue("@grad", grad);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }
        public async Task InsertRadnoVremeAsync(int DanUNedelji, int LokalID, TimeSpan VremeOtvaranja, TimeSpan VremeZatvaranja)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("InsertRadnoVreme", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@DanUNedelji", DanUNedelji);
                    cmd.Parameters.AddWithValue("@LokalID", LokalID);
                    cmd.Parameters.AddWithValue("@VremeOtvaranja", VremeOtvaranja);
                    cmd.Parameters.AddWithValue("@VremeZatvaranja", VremeZatvaranja);
                    //cmd.Parameters.AddWithValue("@EfektivniDatum", null);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        public async IAsyncEnumerable<RadnoVreme> RadnoVremePrikazi(int LokalID)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                conn.Open();
                string query = "SELECT lokal_id, dan_u_nedelji, vreme_otvaranja, vreme_zatvaranja FROM Radno_Vreme WHERE lokal_id = @LokalID ORDER BY dan_u_nedelji";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@LokalID", LokalID);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        var results = new List<object>();
                        while (await reader.ReadAsync())
                        {
                            yield return new RadnoVreme
                            {
                                LokalID = reader.GetInt32(reader.GetOrdinal("lokal_id")),
                                DanUNedelji = reader.GetInt32(reader.GetOrdinal("dan_u_nedelji")),
                                VremeOtvaranja = reader.GetTimeSpan(reader.GetOrdinal("vreme_otvaranja")),
                                VremeZatvaranja = reader.GetTimeSpan(reader.GetOrdinal("vreme_zatvaranja")),
                            };
                        }
                    }
                }
            }
        }

        public async IAsyncEnumerable<Lokal> PopuniMojeLokaleAsync(int id)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                await conn.OpenAsync();
                string query = "select lokal.id, adresa, opstina, grad, naziv from lokal join klub on lokal.klub_id = klub.id join Korisnici on klub.korisnik_id = korisnici.id where korisnici.id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
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
        }
        public async IAsyncEnumerable<Klub> PopuniMojeKluboveAsync(int id)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                await conn.OpenAsync();
                string query = "select id, korisnik_id, naziv from Klub where korisnik_id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            yield return new Klub
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("id")),
                                Naziv = reader.GetString(reader.GetOrdinal("naziv")),
                                KorisnikId = reader.GetInt32(reader.GetOrdinal("korisnik_id")),
                            };
                        }
                    }
                }
            }
        }
    }
}
