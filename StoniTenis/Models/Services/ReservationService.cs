using StoniTenis.Models.Entities;
using System.Data;
using System.Data.SqlClient;

namespace StoniTenis.Models.Services
{
    public class ReservationService
    {
        private readonly ConnectionService _connectionService;

        public ReservationService(ConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        public List<Lokal> PopuniLokale()
        {
            List<Lokal> lokali = new List<Lokal>();

            using (SqlConnection conn = _connectionService.GetConnection())
            {
                conn.Open();
                string sql = "SELECT Id, Adresa, Lokacija FROM Lokal";
                SqlCommand cmd = new SqlCommand(sql, conn);

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        lokali.Add(new Lokal
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            Adresa = reader.GetString(reader.GetOrdinal("Adresa")),
                            Lokacija = reader.GetString(reader.GetOrdinal("Lokacija"))
                        }); ;
                    }
                }
            }

            return lokali;
        }
       
    }
}
