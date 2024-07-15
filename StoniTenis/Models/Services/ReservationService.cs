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
                string sql = "SELECT Lokal.id, Lokal.adresa, Lokal.opstina, Lokal.grad, Klub.naziv FROM Lokal JOIN Klub ON Lokal.klub_id = Klub.id";
                SqlCommand cmd = new SqlCommand(sql, conn);

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        lokali.Add(new Lokal
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            KlubNaziv = reader.GetString(reader.GetOrdinal("Naziv")),
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
