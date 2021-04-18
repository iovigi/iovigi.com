using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Iovigi.Data.Models
{
    public class Menu
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public bool ShowTitle { get; set; }
        public ICollection<MenuItem> MenuItems { get; set; }
        public MenuType MenuType { get; set; }
    }

    public enum MenuType
    {
        Top = 1
    }
}
