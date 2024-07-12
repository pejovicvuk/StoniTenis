using System.Data;
using System.Data.SqlClient;

namespace StoniTenis.Models.Services
{
    public class KorisnikService
    {
        private readonly ConnectionService _connectionService;

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
    }
}
