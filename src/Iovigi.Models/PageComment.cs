using Iovigi.Models.BaseModel;
using System.ComponentModel.DataAnnotations;

namespace Iovigi.Models
{
   public class PageComment : DeletableEntity
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
        public int PageId { get; set; }
        public virtual Page Page { get; set; }

        public int? ParentPageCommentId { get; set; }
    }
}
