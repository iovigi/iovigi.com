using System;

namespace Iovigi.Common.Exceptions
{
    public class BaseException : Exception
    {
        private string error;

        public string Error
        {
            get => this.error ?? base.Message;
            set => this.error = value;
        }
    }
}
