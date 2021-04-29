using Iovigi.Models.BaseModel;
using System.ComponentModel.DataAnnotations;

namespace Iovigi.Models
{
    public class PostKeyword : DeletableEntity
    {
        [Required]
        public int PostId { get; set; }
        public virtual Post Post { get; set; }

        [Required]
        public int KeywordId { get; set; }
        public virtual Keyword Keyword { get; set; }
    }
}
