using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Web.Script.Serialization;

namespace Capstone_csharp.Controllers
{
    public class ForumController : Controller
    {
        //
        // GET: /Forum/

        public ActionResult Index()
        {
            throw new NotImplementedException();
           
        }

        public ActionResult getPosts()
        {
            object postObject = new object();

            // Declare a connection to the database
            using (var db = new Helpers.DAL.CapstoneEntities())
            {
                

                // Pull the parent posts
                var parentPosts = from post in db.tTopicPosts
                                  where post.topicParentID == null
                                  select new Models.PostModel
                                  {
                                      postID = post.topicPostID,
                                      postTopic = post.topicTitle,
                                      postDate = post.topicDate,
                                      postedBy = post.userID,
                                      postBody = post.topicPost
                                  };

                // using the json logic from
                // http://stackoverflow.com/questions/5978904/how-to-build-object-hierarchy-for-serialization-with-json-net
                var jsonPosts = new List<object>();
                foreach (var post in parentPosts)
                {
                    var tempPost = new
                    {
                        post.postID, // anonymous properties gain the name of the 'host' object
                        postDate = post.postDate,
                        postedBy = post.postedBy,
                        postTitle = post.postTopic,
                        postBody = post.postBody,
                        Replys = new List<object>()
                    };

                    var replys = from reply in db.tTopicPosts
                                 where reply.topicParentID == post.postID
                                 select new
                                 {
                                     postID = reply.topicPostID,
                                     postDate = reply.topicDate,
                                     postTitle = reply.topicTitle,
                                     postBody = reply.topicPost
                                 };
                    foreach (var reply in replys)
                    {
                        tempPost.Replys.Add(reply);
                    }

                    jsonPosts.Add(tempPost);
  
                }

                // legacy code - left for learning purposes

                //List<JObject> postJSON = new List<JObject>();
                //foreach (var post in parentPosts)
                //{
                //    JObject pjson = new JObject(
                //            new JProperty("PostID", post.postID),
                //            new JProperty("PostDate", post.postDate.ToString()),
                //            new JProperty("PostedBY:", post.postedBy),
                //            new JProperty("PostTitle", post.postTopic),
                //            new JProperty("PostBody", post.postBody),
                //            new JProperty("Replys",
                //            new JArray(
                //                new JObject(new JProperty("Reply", "test"
                //                //from reply in db.tTopicPosts
                //                //where reply.topicParentID == post.postID
                //                //select new Models.ReplyModel { postID = reply.topicPostID, postDate = reply.topicDate, postBody = reply.topicPost }
                //                )))));

                //    postJSON.Add(pjson);
                //}

                return Json(Newtonsoft.Json.JsonConvert.SerializeObject(jsonPosts), JsonRequestBehavior.AllowGet);
                
            } // close DB connection
        
        }// end get posts

    }
}


				