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
    }
}
