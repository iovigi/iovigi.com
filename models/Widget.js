import mongoose from 'mongoose';

const WidgetSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        en: { type: String },
        bg: { type: String }
    },
    content: {
        en: { type: String },
        bg: { type: String }
    },
    isVisible: {
        en: { type: Boolean, default: true },
        bg: { type: Boolean, default: false }
    }
}, { timestamps: true });

if (mongoose.models.Widget) {
    delete mongoose.models.Widget;
}

export default mongoose.model('Widget', WidgetSchema);
