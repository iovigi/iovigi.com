using System.Collections.Generic;

namespace iovigi.com.web.Data.Models
{
    public class Keyword
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<PostKeyword> Posts { get; set; }
        public virtual ICollection<PageKeyword> Pages { get; set; }
    }
}
