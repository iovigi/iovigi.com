using Iovigi.Common;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Security.Claims;

namespace Iovigi.Infrastructure.Services
{
    internal class CurrentUserService : ICurrentUser
    {
        private readonly ClaimsPrincipal user;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
            => this.user = httpContextAccessor.HttpContext?.User;

        public string UserName { get { return this.user?.Identity?.Name; } }

        public string UserId
        {
            get
            {
                return this.user?
                 .Claims
                 .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)
                 ?.Value;
            }
        }
    }
}
