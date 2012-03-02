using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Capstone_csharp.Helpers
{
    public class HelperQueries
    {
        // method that returns the username as a string.
        public static string GetUserName(int userID)
        {
            if (userID <= 0)
            {
                throw new Exception("Passed UserID is not in proper format");
            }

            // Open the database connection
            using (var db = new Capstone_csharp.Helpers.DAL.CapstoneEntities())
            {
                // Linq has 'navigation properties' - which means YOU DONT HAVE TO WRITE JOINS!
                // amazing stuff - give it a property to search for - then tell it to select from the entity relation you want
                var result = from a in db.tUsers
                           where a.userID == userID // this is our bridge table - tusers. Select by the user ID
                           select new { a.aspnet_Users.UserName }; // Now bridge that with the asp.net membership provider table, and get the username
                
                // the return object was being a pain - so pretend iterate through it
                foreach (var x in result)
                {
                    return x.UserName; // Yep, return the username that appears first. \o/
                }
            }
            return null;
        }


        public static int getUserID(string name)
        {
            using (var db = new Capstone_csharp.Helpers.DAL.CapstoneEntities())
            {
                var result = from t in db.tUsers
                             join o in db.aspnet_Users on t.fk_aspuid equals o.UserId
                             where o.UserName == name
                             select t.userID;

                return result.FirstOrDefault();
            }
        }


    } // end of Helper Queries
}