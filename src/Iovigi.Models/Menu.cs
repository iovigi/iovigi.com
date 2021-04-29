using Iovigi.Models.BaseModel;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Iovigi.Models
{
    public class Menu : DeletableEntity
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
