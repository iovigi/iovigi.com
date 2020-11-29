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

        public string Description { get; set; }

        public string ShortDescription { get; set; }

        public virtual ICollection<PostCategory> Categories { get; set; }

        public virtual ICollection<PostKeyword> Keywords { get; set; }
    }
}
