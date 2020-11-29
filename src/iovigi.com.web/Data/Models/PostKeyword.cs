namespace iovigi.com.web.Data.Models
{
    public class PostKeyword
    {
        public int PostId { get; set; }
        public virtual Post Post { get; set; }

        public int KeywordId { get; set; }
        public virtual Keyword Keyword { get; set; }
    }
}
