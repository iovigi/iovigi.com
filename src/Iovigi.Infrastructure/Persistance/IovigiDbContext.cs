using Iovigi.Common;
using Iovigi.Models;
using Iovigi.Models.BaseModel;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Iovigi.Infrastructure.Persistance
{
    internal class IovigiDbContext : IdentityDbContext<User>, IDbContext
    {
        private readonly ICurrentUser currentUser;

        public IovigiDbContext(DbContextOptions<IovigiDbContext> options, ICurrentUser currentUser)
            : base(options)
        {
            this.currentUser = currentUser;
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<PostCategory>()
                .HasOne(x => x.Category)
                .WithMany(x => x.Posts);

            builder.Entity<PostCategory>()
                .HasOne(x => x.Post)
                .WithMany(x => x.Categories);

            builder.Entity<PostCategory>()
                .HasKey(x => new { x.PostId, x.CategoryId });

            builder.Entity<PostKeyword>()
                .HasOne(x => x.Keyword)
                .WithMany(x => x.Posts);

            builder.Entity<PostKeyword>()
                .HasOne(x => x.Post)
                .WithMany(x => x.Keywords);

            builder.Entity<PostKeyword>()
                .HasKey(x => new { x.PostId, x.KeywordId });

            builder.Entity<PostTag>()
                .HasOne(x => x.Tag)
                .WithMany(x => x.Posts);

            builder.Entity<PostTag>()
                .HasOne(x => x.Post)
                .WithMany(x => x.Tags);

            builder.Entity<PostTag>()
                .HasKey(x => new { x.PostId, x.TagId });

            builder.Entity<PageKeyword>()
                .HasOne(x => x.Keyword)
                .WithMany(x => x.Pages);

            builder.Entity<PageKeyword>()
                .HasOne(x => x.Page)
                .WithMany(x => x.Keywords);

            builder.Entity<PageKeyword>()
                .HasKey(x => new { x.PageId, x.KeywordId });

            builder.Entity<PageTag>()
                .HasOne(x => x.Tag)
                .WithMany(x => x.Pages);

            builder.Entity<PageTag>()
                .HasOne(x => x.Page)
                .WithMany(x => x.Tags);

            builder.Entity<PageTag>()
                .HasKey(x => new { x.PageId, x.TagId });

            builder.Entity<PostComment>()
                .HasOne(x => x.Post)
                .WithMany(x => x.Comments);

            builder.Entity<PageComment>()
                .HasOne(x => x.Page)
                .WithMany(x => x.Comments);

            builder.Entity<MenuItem>()
                .HasOne(x => x.Menu)
                .WithMany(x => x.MenuItems);
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            this.ApplyAuditInformation();

            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = new CancellationToken())
        {
            this.ApplyAuditInformation();

            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void ApplyAuditInformation()
          => this.ChangeTracker
              .Entries()
              .ToList()
              .ForEach(entry =>
              {
                  var userName = this.currentUser.UserName;

                  if (entry.Entity is IDeletableEntity deletableEntity)
                  {
                      if (entry.State == EntityState.Deleted)
                      {
                          deletableEntity.DeletedOn = DateTime.UtcNow;
                          deletableEntity.DeletedBy = userName;
                          deletableEntity.IsDeleted = true;

                          entry.State = EntityState.Modified;

                          return;
                      }
                  }

                  if (entry.Entity is IEntity entity)
                  {
                      if (entry.State == EntityState.Added)
                      {
                          entity.CreatedOn = DateTime.UtcNow;
                          entity.CreatedBy = userName;
                      }
                      else if (entry.State == EntityState.Modified)
                      {
                          entity.ModifiedOn = DateTime.UtcNow;
                          entity.ModifiedBy = userName;
                      }
                  }
              });
    }
}
