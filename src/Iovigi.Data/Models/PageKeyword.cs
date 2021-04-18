namespace Iovigi.Data.Models
{
    public class PageKeyword
    {
        public int PageId { get; set; }
        public virtual Page Page { get; set; }

        public int KeywordId { get; set; }
        public virtual Keyword Keyword { get; set; }
    }
}
