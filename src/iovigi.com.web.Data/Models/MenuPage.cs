namespace iovigi.com.web.Data.Models
{
    public class MenuPage
    {
        public int MenuId { get; set; }
        public virtual Menu Menu { get; set; }

        public int PageId { get; set; }
        public virtual Page Page { get; set; }
    }
}
