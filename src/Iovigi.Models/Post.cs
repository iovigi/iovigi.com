using Iovigi.Models.BaseModel;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Iovigi.Models
{
    public class Post : DeletableEntity
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
