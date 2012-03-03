using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
// include the DAL namespace - hit its in helpers/dal


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

        [HttpGet]
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
               //tShout thisShout = new  thisShout()
               // { 
               //    shoutString = shoutMessage
               //    userID = helpers.helperqueries.getUser--?
               // }
               
                // this tshout how contains everythign we need so copy it to
                // a blank object - that we can JSON encode and return to the browser
                // and use jquery to append it to he html <Span> 



                return Json( JsonObject , JsonRequestBehavior.AllowGet);
            }
            //return ViewResult;
        }

        // public method - anyone can read the shouts -- anonymous users may not participate tho.
        [HttpGet]
        public ActionResult readShout()
        {
            // create your JSon Object context
            using (var db = new Helpers.DAL.CapstoneEntities())
            {
             
                // Linq query
                //var listOfShouts = from x in db.tShouts
                //     select x;

                // listOfShouts is now a loaded collection of all the shouts in the table. what do you do with them
                // to get them back to the browser in a consistent and human readable way?
            }
        }
    }
}
