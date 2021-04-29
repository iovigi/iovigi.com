using Iovigi.Models.BaseModel;

namespace Iovigi.Models
{
    public class PageTag : DeletableEntity
    {
        public int PageId { get; set; }
        public virtual Page Page { get; set; }
        public int TagId { get; set; }
        public virtual Tag Tag { get; set; }
    }
}
