using Iovigi.Models.BaseModel;

namespace Iovigi.Models
{
    public class MenuItem : DeletableEntity
    {
        public int Id { get; set; }

        public int? PageId { get; set; }
        public int? PostId { get; set; }
        public int? CategoryId { get; set; }
        public int MenuId { get; set; }
        public Menu Menu { get; set; }
        public int? ParentMenuItemId { get; set; }
    }
}
