using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;

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
        public ActionResult receiveShout(string shoutMessage, string userID)
        {
            using (var db = new Helpers.DAL.CapstoneEntities())
            {
                var query = from shouts in db.tShouts
                            select new
                            {
                                shouts.shoutString,
                                shouts.tUser.userID
                            };

                List<Object> shoutList = new List<Object>();

                foreach (var shout in query)
                {
                    
                }

                return Json(shoutList, JsonRequestBehavior.AllowGet);

                //shout.shoutString
                //shout.userID
                //db.SaveChanges();
            }
            //return ViewResult;
        }

        [HttpGet]
        public ActionResult sendShout(string shoutMessage, string userID)
        {
            using (var db = new Helpers.DAL.CapstoneEntities())
            {
                
                return null;
            }
        }
    }
}
