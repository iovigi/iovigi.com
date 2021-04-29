using Iovigi.Models.BaseModel;

namespace Iovigi.Models
{
    public class PageKeyword : DeletableEntity
    {
        public int PageId { get; set; }
        public virtual Page Page { get; set; }

        public int KeywordId { get; set; }
        public virtual Keyword Keyword { get; set; }
    }
}
