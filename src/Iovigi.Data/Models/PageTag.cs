namespace Iovigi.Data.Models
{
    public class PageTag
    {
        public int PageId { get; set; }
        public virtual Page Page { get; set; }
        public int TagId { get; set; }
        public virtual Tag Tag { get; set; }
    }
}
