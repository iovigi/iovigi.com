using Iovigi.Models.BaseModel;
using System.Collections.Generic;

namespace Iovigi.Models
{
    public class Tag : DeletableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<PageTag> Pages { get; set; }

        public virtual ICollection<PostTag> Posts { get; set; }
    }
}
