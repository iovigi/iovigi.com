import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
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
    showInMenu: {
        type: Boolean,
        default: true,
    },
    isVisible: {
        en: { type: Boolean, default: true },
        bg: { type: Boolean, default: false }
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
    widgets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Widget'
    }]
}, { timestamps: true });

if (mongoose.models.Page) {
    delete mongoose.models.Page;
}

export default mongoose.model('Page', PageSchema);
