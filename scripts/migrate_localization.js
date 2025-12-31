const mongoose = require('mongoose');

// Define loose schemas just to read/write without validation errors during migration
const PageSchema = new mongoose.Schema({}, { strict: false });
const PostSchema = new mongoose.Schema({}, { strict: false });

const Page = mongoose.model('Page', PageSchema);
const Post = mongoose.model('Post', PostSchema);

const MONGODB_URI = 'mongodb://localhost:27017/iovigi';

async function migrate() {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Migrate Pages
    const pages = await Page.find({});
    console.log(`Found ${pages.length} pages.`);

    for (const p of pages) {
        let modified = false;

        // Migrate title
        if (typeof p.title === 'string') {
            const oldTitle = p.title;
            p.title = { en: oldTitle, bg: '' };
            p.markModified('title');
            modified = true;
        }

        // Migrate content
        if (typeof p.content === 'string') {
            const oldContent = p.content;
            p.content = { en: oldContent, bg: '' };
            p.markModified('content');
            modified = true;
        }

        // Add isVisible if missing
        if (!p.isVisible) {
            p.isVisible = { en: p.showInMenu !== false, bg: false };
            p.markModified('isVisible');
            modified = true;
        }

        if (modified) {
            await p.save();
            console.log(`Migrated Page: ${p._id}`);
        }
    }

    // Migrate Posts
    const posts = await Post.find({});
    console.log(`Found ${posts.length} posts.`);

    for (const p of posts) {
        let modified = false;

        if (typeof p.title === 'string') {
            const oldTitle = p.title;
            p.title = { en: oldTitle, bg: '' };
            p.markModified('title');
            modified = true;
        }

        if (typeof p.content === 'string') {
            const oldContent = p.content;
            p.content = { en: oldContent, bg: '' };
            p.markModified('content');
            modified = true;
        }

        if (typeof p.excerpt === 'string') {
            const oldExcerpt = p.excerpt;
            p.excerpt = { en: oldExcerpt, bg: '' };
            p.markModified('excerpt');
            modified = true;
        } else if (!p.excerpt) {
            p.excerpt = { en: '', bg: '' };
            p.markModified('excerpt');
            modified = true;
        }

        // Add isVisible
        if (!p.isVisible) {
            p.isVisible = { en: true, bg: false };
            p.markModified('isVisible');
            modified = true;
        }

        if (modified) {
            await p.save();
            console.log(`Migrated Post: ${p._id}`);
        }
    }

    console.log('Migration Complete.');
    process.exit(0);
}

migrate().catch(console.error);
