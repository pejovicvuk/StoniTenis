using System.Configuration;

namespace StoniTenis.DataAccess
{
    public static class SqlDataAccess
    {
            public static string GetConnectionString(IConfiguration configuration, string name = "DefaultConnection")
            {
                return configuration.GetConnectionString(name);
            }
    }
}
