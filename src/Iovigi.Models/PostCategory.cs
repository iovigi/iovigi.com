using Iovigi.Models.BaseModel;
using System.ComponentModel.DataAnnotations;

namespace Iovigi.Models
{
    public class PostCategory : DeletableEntity
    {
        [Required]
        public int PostId { get; set; }
        public Post Post { get; set; }

        [Required]
        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
