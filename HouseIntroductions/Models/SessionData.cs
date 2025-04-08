//CONNECTION STRING
using System.Configuration;
//SQLCONNECTION
using System.Data.SqlClient;


namespace HouseJournals.Models
{
    public class SessionData
    {
        public string SessionNumber { get; set; }
        public string SessionYear { get; set; }
        public string LsYear { get; set; }


        // Query databse to set object with data.
        public void SetSessionData()
        {
            string cs = ConfigurationManager.ConnectionStrings["Schedules"].ConnectionString;
            SqlConnection conn = new SqlConnection(cs);

            string query = "SELECT "
                                + " COALESCE([ls_year], '') AS ls_year, "
                                + " COALESCE([session_year], '') AS session_year, "
                                + " COALESCE([session_number], '') AS session_number "

                                + " FROM [Schedules].[dbo].[tlkpSessions] "
                                + " WHERE [fCurrent] = 1 ;";

            conn.Open();
            using (var cmd = new SqlCommand(query, conn))
            {
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    int LsYearOrd = reader.GetOrdinal("ls_year");
                    int SessionYearOrd = reader.GetOrdinal("session_year");
                    int SessionNumberOrd = reader.GetOrdinal("session_number");

                    while (reader.Read())
                    {
                        LsYear = reader.GetInt32(LsYearOrd).ToString();
                        SessionYear = reader.GetInt32(SessionYearOrd).ToString();
                        SessionNumber = reader.GetInt32(SessionNumberOrd).ToString();
                    }
                }
                cmd.Parameters.Clear();
                cmd.Dispose();
            }
            conn.Close();
        }

        // End Session Data Class.



    }
}