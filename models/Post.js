import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true },
        bg: { type: String }
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        en: { type: String },
        bg: { type: String }
    },
    excerpt: {
        en: { type: String },
        bg: { type: String }
    },
    isVisible: {
        en: { type: Boolean, default: true },
        bg: { type: Boolean, default: false }
    },
    image: {
        type: String, // Path to image
    },
    author: {
        type: String,
        default: 'Admin',
    },
}, { timestamps: true });

if (mongoose.models.Post) {
    delete mongoose.models.Post;
}

export default mongoose.model('Post', PostSchema);
