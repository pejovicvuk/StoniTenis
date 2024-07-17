using Microsoft.AspNetCore.Authentication;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;

namespace StoniTenis.Models.Services
{
    public class KorisnikService
    {
        private readonly ConnectionService _connectionService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public KorisnikService(ConnectionService connectionService)
        {
            _connectionService = connectionService;
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

        public void InsertKorisnik(string ime, string prezime, string email, bool vlasnik)
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
                    cmd.ExecuteNonQuery();
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

        public void PostaniVlasnik(int id)
        {
            using (SqlConnection conn = _connectionService.GetConnection())
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("PostaniVlasnik", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.ExecuteNonQuery ();
                }
            }
        }
    }
}
