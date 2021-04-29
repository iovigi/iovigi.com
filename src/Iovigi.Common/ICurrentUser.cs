namespace Iovigi.Common
{
    public interface ICurrentUser
    {
        string UserId { get; }

        string UserName { get; }
    }
}
