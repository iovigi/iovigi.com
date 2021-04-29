using Iovigi.Models.BaseModel;
using System.Collections.Generic;

namespace Iovigi.Models
{
    public class Keyword : DeletableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<PostKeyword> Posts { get; set; }
        public virtual ICollection<PageKeyword> Pages { get; set; }
    }
}
