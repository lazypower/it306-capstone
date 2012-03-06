using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using Newtonsoft.Json.Linq;
// include the DAL namespace - hint it's in helpers/dal
using Capstone_csharp.Helpers.DAL;


namespace Capstone_csharp.Controllers
{
    public class ShoutBoxController : Controller
    {
        //
        // GET: /ShoutBox/

        public ActionResult Index()
        {

                
                return View();
        }

        [Authorize]
        [HttpPost]
        // set this to require authorization
        public ActionResult createShout(string shoutMessage)
        {
            // pull the person making the shout from the
            // current session
            string userName = User.Identity.Name;

            // Declare our database context
            // 
            using (var db = new Helpers.DAL.CapstoneEntities())
            {
               // Declare a new shout - use the Entity Framework object
               // to make this easier use object initialization format
                Helpers.DAL.tShout thisShout = new Helpers.DAL.tShout()
                {
                    shoutString = shoutMessage,
                    userID = Helpers.HelperQueries.getUserID(userName)
                };

                db.AddTotShouts(thisShout);
                db.SaveChanges();

                // this tshout now contains everything we need to copy it to
                // a blank object - that we can JSON encode and return to the browser
                // and use jquery to append it to he html <Span>
                return Json(thisShout, JsonRequestBehavior.AllowGet);
            }
        }

         //public method - anyone can READ
        [HttpGet]
        public ActionResult readShout()
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
                        userID = Helpers.HelperQueries.GetUserName((int)shout.userID)
                    };

                    p.Add(y);
                }


                // return JSON
                return Json(p, JsonRequestBehavior.AllowGet);
                
            }
        }
    }
}
