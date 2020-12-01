namespace iovigi.com.web.Data.Models
{
    public class MenuPost
    {
        public int MenuId { get; set; }
        public virtual Menu Menu { get; set; }

        public int PostId { get; set; }
        public virtual Post Post { get; set; }
    }
}
