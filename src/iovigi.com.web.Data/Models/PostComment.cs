using System.ComponentModel.DataAnnotations;

namespace iovigi.com.web.Data.Models
{
    public class PostComment
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Comment { get; set; }

        [Required]
        public int PostId { get; set; }
        public virtual Post Post { get; set; }

        public int? ParentPostCommentId { get; set; }
    }
}
