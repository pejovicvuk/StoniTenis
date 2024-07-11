using System.Data.SqlClient;

namespace StoniTenis.Models.Services
{
    public class ConnectionService
    {
        private readonly string _connectionString;

        public ConnectionService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public SqlConnection GetConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
