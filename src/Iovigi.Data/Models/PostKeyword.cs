using System.ComponentModel.DataAnnotations;

namespace Iovigi.Data.Models
{
    public class PostKeyword
    {
        [Required]
        public int PostId { get; set; }
        public virtual Post Post { get; set; }

        [Required]
        public int KeywordId { get; set; }
        public virtual Keyword Keyword { get; set; }
    }
}
