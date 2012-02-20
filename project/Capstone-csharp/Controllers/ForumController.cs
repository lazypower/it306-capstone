using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using System.Text;


namespace Capstone_csharp.Controllers
{
    public class ForumController : Controller
    {
        //
        // GET: /Forum/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult getPosts()
        {
            object postObject = new object();

            // Declare a connection to the database
            using (var db = new Helpers.DAL.CapstoneEntities())
            {
                

                // Pull the parent posts using Linq
                var parentPosts = from post in db.tTopicPosts
                                  where post.topicParentID == null // this denotes it is a root-level post. or a Parent post
                                  select new 
                                  {
                                      postID = post.topicPostID,
                                      postTopic = post.topicTitle,
                                      postDate = post.topicDate,
                                      postedBy = post.userID,
                                      postBody = post.topicPost
                                  };

                // using the json logic from
                // http://stackoverflow.com/questions/5978904/how-to-build-object-hierarchy-for-serialization-with-json-net
                // build a list to hold all of the post objects
                var jsonPosts = new List<object>();

                // Iterate through each post - and build an object that we can serialize to JSON
                foreach (var post in parentPosts)
                {
                    // Declare it as a temporary post - not very memory efficient but it works
                    var tempPost = new
                    {
                        // Set each property - since this is an anonymous object, we could be arbitrary
                        // with the property names - but lets be intelligent here
                        post.postID, // anonymous properties gain the name of the 'host' object
                        postDate = post.postDate.ToShortDateString() + " @ " + post.postDate.ToShortTimeString(), // by default, dates are serial strings that make no sense - ms from epoch?
                        postedBy = Helpers.HelperQueries.GetUserName(post.postedBy),
                        postTitle = post.postTopic,
                        postBody = post.postBody,
                        Replys = new List<object>() // important - notice how its a list of object?
                    };

                    // lets use the prior list now - pull the replys we want to populate it with
                    var replys = from reply in db.tTopicPosts
                                 where reply.topicParentID == post.postID
                                 // remember that whole list of object thing above?
                                 // we can be arbitrary here too - lets not get funky tho
                                 select new
                                 {
                                     postID = reply.topicPostID,
                                     postedBy = reply.userID,
                                     postDate = reply.topicDate,
                                     postTitle = reply.topicTitle,
                                     postBody = reply.topicPost
                                 };
                    // Now ITERATE ALL THE THINGS AGAIN!!
                    foreach (var reply in replys)
                    {
                        var tempReply = new
                            {
                                postID = reply.postID,
                                postedBy = Helpers.HelperQueries.GetUserName(reply.postedBy),
                                postDate = reply.postDate.ToShortDateString() + " @ " + reply.postDate.ToShortTimeString(), // by default, dates are serial strings that make no sense - ms from epoch?
                                postBody = reply.postBody
                            };
                        // add it to the temporary post object
                        tempPost.Replys.Add(tempReply);
                    }

                    // add it to the parent list 
                    jsonPosts.Add(tempPost);
  
                }

                // serialize it and return it.
                return Json(Newtonsoft.Json.JsonConvert.SerializeObject(jsonPosts), JsonRequestBehavior.AllowGet);
                
            } // close DB connection
        
        }// end get posts

    }
}


				