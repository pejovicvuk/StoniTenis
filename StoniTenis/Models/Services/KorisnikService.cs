using Microsoft.AspNetCore.Authentication;
using Microsoft.Identity.Client;
using StoniTenis.Models.Entities;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Security.Claims;

namespace StoniTenis.Models.Services
{
    public class KorisnikService
    {
        private readonly ConnectionService _connectionService;
        private readonly IHttpContextAccessor _contextAccessor;

        public KorisnikService(ConnectionService connectionService, IHttpContextAccessor contextAccessor)
        {
            _connectionService = connectionService;
            _contextAccessor = contextAccessor;
        }

        public bool KorisnikPostoji(string email)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                conn.Open();
                string query = "SELECT COUNT(*) FROM Korisnici WHERE Email = @Email";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);
                    int count = Convert.ToInt32(cmd.ExecuteScalar());
                    return count > 0;
                }
            }
        }

        public async Task InsertKorisnik(string ime, string prezime, string email, bool vlasnik)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("InsertKorisnik", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Ime", ime);
                    cmd.Parameters.AddWithValue("@Prezime", prezime);
                    cmd.Parameters.AddWithValue("@Email", email);
                    cmd.Parameters.AddWithValue("@Vlasnik", vlasnik);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        public async ValueTask<int> ReturnIdAsync(string email)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                conn.Open();
                string query = "select top 1 id from korisnici where email = @Email";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);
                    int id =  Convert.ToInt32(await cmd.ExecuteScalarAsync());
                    return id;
                }
            }
        }

        public async Task PostaniVlasnik(int id)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("PostaniVlasnik", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Id", id);
                    await cmd.ExecuteNonQueryAsync();
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
        public async Task<bool> IsVlasnik(int id)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                conn.Open();
                string query = "select count(*) from korisnici where id = @Id and vlasnik = 1";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@ID", id);
                    int count = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                    if (count > 0)
                        return true;
                    else
                        return false;
                }
            }
        }
    }
}
