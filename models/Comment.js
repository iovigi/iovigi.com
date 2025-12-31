import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    locale: {
        type: String,
        default: 'en',
    }
}, { timestamps: true });

// Force recompilation to pick up schema changes
if (mongoose.models.Comment) {
    delete mongoose.models.Comment;
}

export default mongoose.model('Comment', CommentSchema);
