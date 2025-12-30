import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String, // HTML content
        required: true,
    },
    excerpt: {
        type: String,
    },
    image: {
        type: String, // Path to image
    },
    author: {
        type: String,
        default: 'Admin',
    },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
