using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace iovigi.com.web.Data.Models
{
    public class Menu
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public bool ShowTitle { get; set; }

        public ICollection<MenuPage> Pages { get; set; }
        public ICollection<MenuPost> Posts { get; set; }
    }
}
