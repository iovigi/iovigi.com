using Iovigi.Common;
using Iovigi.Models;
using Iovigi.Infrastructure.Configuration;
using Iovigi.Infrastructure.Persistance;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;
using Microsoft.OpenApi.Models;
using Iovigi.Infrastructure.Services;
using Iovigi.Identity;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Iovigi.Infrastructure.Behaviours;

namespace Iovigi.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddServiceCollection(
        this IServiceCollection services,
        IConfiguration configuration)
        => services
            .AddDatabase(configuration)
            .AddIdentity(configuration)
            .AddSwagger()
            .AddMediatR(Assembly.GetExecutingAssembly())
            .AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestValidationBehavior<,>))
            .AddApplicationServices()
            .AddInitialData()
            .AddAutoMapper(Assembly.GetExecutingAssembly())
            .AddWebComponents();



        private static IServiceCollection AddDatabase(
             this IServiceCollection services,
             IConfiguration configuration)
             => services
                 .AddDbContext<IovigiDbContext>(options => options
                        .UseNpgsql(
                                configuration.GetConnectionString("DefaultConnection"),
                         sqlServer => sqlServer
                             .MigrationsAssembly(typeof(IovigiDbContext).Assembly.FullName)))
                 .AddTransient<IInitializer, DatabaseInitializer>();

        private static IServiceCollection AddIdentity(
            this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddIdentity<User, IdentityRole>(options =>
                {
                    options.Password.RequiredLength = 6;
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;
                })
                .AddEntityFrameworkStores<IovigiDbContext>();

            var secret = configuration
                .GetSection(nameof(ApplicationSettings))
                .GetValue<string>(nameof(ApplicationSettings.Secret));

            var key = Encoding.ASCII.GetBytes(secret);

            services
                .AddAuthentication(authentication =>
                {
                    authentication.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    authentication.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(bearer =>
                {
                    bearer.RequireHttpsMetadata = false;
                    bearer.SaveToken = true;
                    bearer.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            return services;
        }


        private static IServiceCollection AddSwagger(this IServiceCollection services)
        => services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(
                    "v1",
                    new OpenApiInfo
                    {
                        Title = "My Iovigi API",
                        Version = "v1"
                    });
            });

        private static IServiceCollection AddWebComponents(this IServiceCollection services)
        {
            services.AddControllers()
                    .AddFluentValidation(validation => validation
                        .RegisterValidatorsFromAssemblyContaining<Result>())
                    .AddNewtonsoftJson();

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });


            return services;
        }

        private static IServiceCollection AddApplicationServices(this IServiceCollection services)
        => services
            .AddScoped<ICurrentUser, CurrentUserService>()
            .AddScoped<IJwtTokenGenerator, JwtTokenGeneratorService>();

        private static IServiceCollection AddInitialData(this IServiceCollection services)
        => services
            .Scan(scan => scan
                .FromCallingAssembly()
                .AddClasses(classes => classes
                    .AssignableTo(typeof(IInitialData)))
                .AsImplementedInterfaces()
                .WithTransientLifetime());
    }
}
