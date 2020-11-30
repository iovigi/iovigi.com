using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iovigi.com.web.Data.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<PageTag> Pages { get; set; }

        public virtual ICollection<PostTag> Posts { get; set; }
    }
}
