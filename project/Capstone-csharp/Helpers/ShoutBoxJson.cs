using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace Capstone_csharp.Helpers
{
    public static class ShoutBoxJson
    {
        public static string FetchShoutBoxJson()
        {
            // create your JSon Object context
            using (var db = new Helpers.DAL.CapstoneEntities())
            {

                // Linq query
                // var listOfShouts = from x in db.tShouts
                // select x;
                var listOfShouts = from x in db.tShouts
                                   select x;
                                   
                                   /*new Models.ShoutModel()
                                   {
                                       // This is stupid - entity framework until its fully assigned says ?int 
                                       // and i said " Look bitch, its an int. GTFO" -- seems needless i know
                                       // but it worked. Pseudo objects blow under certain circumstances
                                       userID = String.Format("{0}", x.userID),
                                       shoutString = x.shoutString
                                   };*/


                // You have a list of shouts, iterate through them and add them to the return object
                var p = new List<Models.ShoutModel>();
                foreach (var shout in listOfShouts)
                {
                    var y = new Models.ShoutModel()
                    {
                        shoutString = shout.shoutString,
                        userID = HelperQueries.GetUserName((int)shout.userID)
                    };

                    p.Add(y);
                }


                // return JSON
                return (JsonConvert.SerializeObject(p));
                
            }
        }

    }
}