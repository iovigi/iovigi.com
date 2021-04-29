using Iovigi.Models.BaseModel;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Iovigi.Models
{
    public class Category : DeletableEntity
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public int? ParentCategoryId { get; set; }

        public virtual ICollection<PostCategory> Posts { get; set; }
    }
}
