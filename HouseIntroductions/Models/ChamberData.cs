using System;
using System.Collections.Generic;
using System.Linq;

//CONNECTION STRING
using System.Configuration;
//SQLCONNECTION
using System.Data.SqlClient;
//REGEX
using System.Text.RegularExpressions;


namespace HouseIntroductions.Models
{
    public class ChamberData
    {

        public class ChamberDisplayBoard
        {
            public string Line1 { get; set; }
            public string Line2 { get; set; }
            public string Line3 { get; set; }
            public string Line4 { get; set; }
            public string Line5 { get; set; }
            public string Line6 { get; set; }
            public string Line7 { get; set; }

            public string DateUpdated { get; set; }
        }


        // Query databse to set object with data.
        public string CurrentChamberData(HouseIntroductions.Models.SessionData SessionInfo)
        {
            string cs = ConfigurationManager.ConnectionStrings["House1"].ConnectionString;
            //string cs = ConfigurationManager.ConnectionStrings["House113"].ConnectionString;
            SqlConnection conn = new SqlConnection(cs);

            string query = "SELECT "
                                + " COALESCE([strLine1_], '') AS Line1, "
                                + " COALESCE([strLine2_], '') AS Line2, "
                                + " COALESCE([strLine3_], '') AS Line3, "
                                + " COALESCE([strLine4_], '') AS Line4, "
                                + " COALESCE([strLine5_], '') AS Line5, "
                                + " COALESCE([strLine6_], '') AS Line6, "
                                + " COALESCE([strLine7_], '') AS Line7, "
                                + " COALESCE([dtUpdate], '') AS UpdateTime "

                                + " FROM [House1].[dbo].[tblChamberDisplay] ";

            ChamberDisplayBoard CDB = new ChamberDisplayBoard();

            conn.Open();
            using (var cmd = new SqlCommand(query, conn))
            {
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    int line1Ord = reader.GetOrdinal("Line1");
                    int line2Ord = reader.GetOrdinal("Line2");
                    int line3Ord = reader.GetOrdinal("Line3");
                    int line4Ord = reader.GetOrdinal("Line4");
                    int line5Ord = reader.GetOrdinal("Line5");
                    int line6Ord = reader.GetOrdinal("Line6");
                    int line7Ord = reader.GetOrdinal("Line7");
                    int DateOrd = reader.GetOrdinal("UpdateTime");

                    while (reader.Read())
                    {
                        CDB.Line1 = reader.GetString(line1Ord);
                        CDB.Line2 = reader.GetString(line2Ord);
                        CDB.Line3 = reader.GetString(line3Ord);
                        CDB.Line4 = reader.GetString(line4Ord);
                        CDB.Line5 = reader.GetString(line5Ord);
                        CDB.Line6 = reader.GetString(line6Ord);
                        CDB.Line7 = reader.GetString(line7Ord);
                        CDB.DateUpdated = reader.GetDateTime(DateOrd).ToLongDateString();
                    }
                }
                cmd.Parameters.Clear();
                cmd.Dispose();
            }
            conn.Close();

            // Send back the chamber display object.
            return LookForLinkableInfo(CDB, SessionInfo);
        }







        public string LookForLinkableInfo(ChamberDisplayBoard cData, SessionData sData)
        {

            // Loops over each property in cData
            foreach (var property in PropertiesOfType<string>(cData))
            {
                var name = property.Key;
                var val = property.Value;

                // Sets the properties with changed string data/ links added.
                cData.GetType().GetProperty(name).SetValue(cData, AddBillLinks(val), null);
                cData.GetType().GetProperty(name).SetValue(cData,
                    AddAmendmentLinks(cData.GetType().GetProperty(name).GetValue(cData, null).ToString(), sData), null);

            }

            string ReturnValue = "";

            // Loops over each property in cData
            foreach (var property in PropertiesOfType<string>(cData))
            {
                var name = property.Key;
                var val = property.Value;

                if (name != "DateUpdated" && !String.IsNullOrEmpty(property.Value))
                {
                    ReturnValue += property.Value + " ";
                }
            }

            return ReturnValue;

        }


        public string AddBillLinks(string StringData)
        {

            // Find a match for H#### string.
            var Matches = Regex.Matches(StringData, @"(?<=\s|^)([A-Za-z]{1,3}|([A-Za-z]\.){1,3}) *([Nn]\.[Oo]\.|[Nn][Oo]\.)? *[0-9]{1,4}(?=\s|$)");
            var list = Matches.Cast<Match>().Select(match => match.Value).ToList();
            foreach (var match in list)
            {

                // Clean up the bill number by removing spaces/periods so it can be used in a link.
                string BillNumber = Regex.Replace(match, @"(?i)[N][O]|\s|\.", String.Empty);
                BillNumber = Regex.Replace(BillNumber, @"(?i)[S][C][R]", "SC");
                BillNumber = Regex.Replace(BillNumber, @"(?i)[H][C][R]", "HC");

                // Update line3string with a link replacing the matched file number.
                StringData = Regex.Replace(StringData, match,
                    "<a class='nav-link d-inline' href='http://www.house.leg.state.mn.us/bills/billnum.asp?billnumber=" + BillNumber + "' target='_blank'>" + match + "</a>");
            }

            // Set the data back to the object.
            return StringData;
        }


        public string AddAmendmentLinks(string StringData, SessionData sData)
        {
            // Examples:
            //  H0001A1    S0002A34
            //  A15-522    A15-0804
            //  SCR8-A9

            // Find a match for examples like above.
            var Matches = Regex.Matches(StringData, @"(?<=\s|^)([A-Za-z]{1,3})[0-9]{1,4}-?([A-Za-z]{1,3})?[0-9]{1,4}(?=\s|$)");
            var list = Matches.Cast<Match>().Select(match => match.Value).ToList();
            foreach (var match in list)
            {
                // If the match was found then replace that match with a link where
                //  the text of the link is the H####.

                // matches like a15-0804 or S0002A34 will be accepted as the 'code' url parameter.
                string LinkString = "http://www.house.leg.state.mn.us/cco/amend.asp?code=" + match + "&ls_year=" + sData.LsYear
                                                + "&session_number=" + sData.SessionNumber + "&session_year=" + sData.SessionYear;

                StringData = Regex.Replace(StringData, match, "<a class='nav-link d-inline' href='" + LinkString + "' target='_blank'>" + match + "</a>");

            }

            return StringData;

        }


        public static IEnumerable<KeyValuePair<string, T>> PropertiesOfType<T>(object obj)
        {
            return from p in obj.GetType().GetProperties()
                   where p.PropertyType == typeof(T)
                   select new KeyValuePair<string, T>(p.Name, (T)p.GetValue(obj, null));
        }







        // End Chamber Data Class.
    }

}