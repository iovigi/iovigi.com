const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iovigi';
        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !password) {
            console.error('Error: ADMIN_USERNAME and ADMIN_PASSWORD must be defined in .env.local');
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Define User Schema inline to avoid module issues with the app's ESM model
        const UserSchema = new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true },
        }, { timestamps: true });

        // Prevent OverwriteModelError if running multiple times in same process (unlikely here but good practice)
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findOneAndUpdate(
            { username },
            { username, password: hashedPassword },
            { upsert: true, new: true }
        );

        console.log(`Admin user '${username}' seeded successfully.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
