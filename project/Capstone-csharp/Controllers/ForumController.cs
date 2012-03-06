using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using System.Text;
using Capstone_csharp.Models;
using MSA = Microsoft.Security.Application;


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

        [Authorize]
        [HttpPost]
        public ActionResult postComment(int postID, string comment)
        {

            // Do some data transforms, and encoding
            comment = comment.Trim();
                      

            // Declare our database connection // will exist only in the scope
            // of the using statement.
            using (Helpers.DAL.CapstoneEntities db = new Helpers.DAL.CapstoneEntities())
            {
                Helpers.DAL.tTopicPost commentPost = new Helpers.DAL.tTopicPost()
                {
                    topicParentID = postID,
                    topicPost = comment,
                    topicDate = DateTime.Now,
                    userID = Helpers.HelperQueries.getUserID(User.Identity.Name),
                    // theres a ridiculous bug here - it wont let me save null
                    // objects on a nullable field, so set the title to 0
                    topicTitle = "0"
                };

                
                

                db.AddTotTopicPosts(commentPost);
                db.SaveChanges();
            }


            // This is where data modeling comes in handy. I hate that I have to declare yet ANOTHER model, but hey we cant have our cake and eat it too.
            ReplyModel returnObject = new ReplyModel()
            {
                parentID = postID,
                postBody = MSA.Encoder.HtmlEncode(comment),
                postDate = DateTime.Now.ToShortDateString() + " @ " + DateTime.Now.ToShortTimeString(),
                postedBy = User.Identity.Name
            };

                return Json(returnObject, JsonRequestBehavior.AllowGet);        
            
        }

        [Authorize]
        [HttpPost]
        public ActionResult createPost(string postTitle, string postBody)
        {
            // clean up the whitespace
            postBody = postBody.Trim();
            postTitle = postTitle.Trim();

           // Declare our database connection // will exist only in the scope
            // of the using statement.
            using (Helpers.DAL.CapstoneEntities db = new Helpers.DAL.CapstoneEntities())
            {
                Helpers.DAL.tTopicPost newPost = new Helpers.DAL.tTopicPost()
                {
                    userID = Helpers.HelperQueries.getUserID(User.Identity.Name),
                    topicTitle = postTitle,
                    topicDate = DateTime.Now,
                    topicPost = postBody

                };

                db.AddTotTopicPosts(newPost);
                db.SaveChanges();

                object returnData = new
                {
                    postID = newPost.topicPostID,
                    postedBy = User.Identity.Name,
                    postTitle = postTitle,
                    postBody = postBody,
                    postDate = DateTime.Now.ToShortDateString() + " @ " + DateTime.Now.ToShortTimeString()
                };
                
                return Json(returnData, JsonRequestBehavior.AllowGet);
            }
        }

        
        public ActionResult deletePost(int postID)
        {

            using (Helpers.DAL.CapstoneEntities db = new Helpers.DAL.CapstoneEntities())
            {
                var replies = from x in db.tTopicPosts
                        where (x.topicParentID == postID)
                        select x;

                foreach(var reply in replies)
                {
                    
                    // attach it back to the table (?) i know this is dumb
                    db.CreateObjectSet<Helpers.DAL.tTopicPost>().Attach(reply);

                    // Delete it
                    db.ObjectStateManager.ChangeObjectState(reply, System.Data.EntityState.Deleted);
                    
                }
                

                // this is a bit of mojo to delete a post without a stored proc
                var post = new Helpers.DAL.tTopicPost();

                // create a post, assign its id
                post.topicPostID = postID;

                // attach it back to the table (?) i know this is dumb
                db.CreateObjectSet<Helpers.DAL.tTopicPost>().Attach(post);

                // Delete it
                db.ObjectStateManager.ChangeObjectState(post, System.Data.EntityState.Deleted);
                db.SaveChanges();
                    
            };

            return Json(postID);
        }


    }
}


				