using System;

namespace Iovigi.Models.BaseModel
{
    public interface IDeletableEntity : IEntity
    {
        DateTime? DeletedOn { get; set; }

        string DeletedBy { get; set; }

        bool IsDeleted { get; set; }
    }
}
