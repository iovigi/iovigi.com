using System;
using System.Collections.Generic;

namespace Iovigi.Common
{
    public interface IInitialData
    {
        Type EntityType { get; }

        IEnumerable<object> GetData();
    }
}
