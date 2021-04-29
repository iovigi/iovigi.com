using Iovigi.Models;

namespace Iovigi.Identity
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }
}
