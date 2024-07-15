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
                string sql = "SELECT Id, Klub_Id, Adresa, Opstina, Grad FROM Lokal";
                SqlCommand cmd = new SqlCommand(sql, conn);

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        lokali.Add(new Lokal
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            KlubID = reader.GetInt32(reader.GetOrdinal("Klub_Id")),
                            Adresa = reader.GetString(reader.GetOrdinal("Adresa")),
                            Opstina = reader.GetString(reader.GetOrdinal("Opstina")),
                            Grad = reader.GetString(reader.GetOrdinal("Grad"))
                        }); ;
                    }
                }
            }

            return lokali;
        }
       
    }
}
