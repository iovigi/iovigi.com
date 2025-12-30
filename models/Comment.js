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
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
