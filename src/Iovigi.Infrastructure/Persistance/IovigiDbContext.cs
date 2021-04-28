using Iovigi.Common;
using Iovigi.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Iovigi.Infrastructure.Persistance
{
    public class IovigiDbContext : IdentityDbContext<User>, IDbContext
    {
        public IovigiDbContext(DbContextOptions<IovigiDbContext> options)
            : base(options)
        {
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
    }
}
