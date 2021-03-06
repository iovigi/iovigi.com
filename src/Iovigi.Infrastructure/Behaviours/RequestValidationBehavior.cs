﻿using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using Iovigi.Infrastructure.Exceptions;
using MediatR;

namespace Iovigi.Infrastructure.Behaviours
{
    public class RequestValidationBehavior<TRequest, TResponse>
           : IPipelineBehavior<TRequest, TResponse>
           where TRequest : IRequest<TResponse>
    {
        private readonly IEnumerable<IValidator<TRequest>> validators;

        public RequestValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
            => this.validators = validators;

        public Task<TResponse> Handle(
            TRequest request,
            CancellationToken cancellationToken,
            RequestHandlerDelegate<TResponse> next)
        {
            var errors = this
                .validators
                .Select(v => v.Validate(request))
                .SelectMany(result => result.Errors)
                .Where(f => f != null)
                .ToList();

            if (errors.Count != 0)
            {
                throw new ModelValidationException(errors);
            }

            return next();
        }
    }
}
