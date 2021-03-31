namespace iovigi.com.web.Data.Models
{
    public class MenuItem
    {
        public int Id { get; set; }

        public int? PageId { get; set; }
        public int? PostId { get; set; }
        public int MenuId { get; set; }
        public Menu Menu { get; set; }
        public int? ParentMenuItemId { get; set; }
    }
}
