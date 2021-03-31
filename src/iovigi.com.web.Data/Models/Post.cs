using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace iovigi.com.web.Data.Models
{
    public class Post
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Body { get; set; }

        [Required]
        public string ShortBody { get; set; }

        public virtual ICollection<PostCategory> Categories { get; set; }

        public virtual ICollection<PostTag> Tags { get; set; }

        public virtual ICollection<PostKeyword> Keywords { get; set; }

        public virtual ICollection<PostComment> Comments { get; set; }
    }
}
