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

                List<JObject> postJSON = new List<JObject>();
                foreach (var post in parentPosts)
                {
                    JObject pjson = new JObject(
                            new JProperty("PostID", post.postID),
                            new JProperty("PostDate", post.postDate.ToString()),
                            new JProperty("PostedBY:", post.postedBy),
                            new JProperty("PostTitle", post.postTopic),
                            new JProperty("PostBody", post.postBody),
                            new JProperty("Replys",
                            new JArray(
                                new JObject(new JProperty("Reply", "test"
                                //from reply in db.tTopicPosts
                                //where reply.topicParentID == post.postID
                                //select new Models.ReplyModel { postID = reply.topicPostID, postDate = reply.topicDate, postBody = reply.topicPost }
                                )))));

                    postJSON.Add(pjson);
                }

                return Json(Newtonsoft.Json.JsonConvert.SerializeObject(postJSON), JsonRequestBehavior.AllowGet);
                
            } // close DB connection
        
        }// end get posts

    }
}


				