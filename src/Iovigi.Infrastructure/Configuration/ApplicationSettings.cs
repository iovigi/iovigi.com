﻿namespace Iovigi.Infrastructure.Configuration
{
    internal class ApplicationSettings
    {
        public ApplicationSettings() => this.Secret = default!;

        public string Secret { get; private set; }
    }
}
