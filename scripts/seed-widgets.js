const mongoose = require('mongoose');

const WidgetSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    title: { en: String, bg: String },
    content: { en: String, bg: String },
    isVisible: {
        en: { type: Boolean, default: true },
        bg: { type: Boolean, default: false }
    }
}, { timestamps: true });

const Widget = mongoose.models.Widget || mongoose.model('Widget', WidgetSchema);

async function seedWidgets() {
    await mongoose.connect('mongodb://localhost:27017/iovigi');

    const key = 'about-me';
    const existing = await Widget.findOne({ key });

    if (existing) {
        console.log(`Widget '${key}' already exists.`);
    } else {
        await Widget.create({
            key,
            title: {
                en: 'About Me',
                bg: 'За Мен'
            },
            content: {
                en: '<p>Welcome to my personal blog of Iliya Nedelchev</p>',
                bg: '<p>Добре дошли в личния блог на Илия Неделчев</p>'
            },
            isVisible: {
                en: true,
                bg: true
            }
        });
        console.log(`Widget '${key}' created.`);
    }

    await mongoose.disconnect();
}

seedWidgets().catch(console.error);
