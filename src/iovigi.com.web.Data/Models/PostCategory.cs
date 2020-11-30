using System.ComponentModel.DataAnnotations;

namespace iovigi.com.web.Data.Models
{
    public class PostCategory
    {
        [Required]
        public int PostId { get; set; }
        public Post Post { get; set; }

        [Required]
        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
