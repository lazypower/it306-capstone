using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace Capstone_csharp.Models
{
    public class ReplyModel
    {
        // Implement DataMembers for serialization purposes - LINQ is a fuckwad sometimes

        [DataMember]
        public int postID { get; set; }

        [DataMember]
        public string postedBy { get; set; }

        [DataMember]
        public string postBody { get; set; }

        [DataMember]
        public string postDate { get; set; }

        [DataMember]
        public int parentID { get; set; }

    }


}