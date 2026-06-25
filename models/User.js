import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    apiKey: {
        type: String,
        unique: true,
        sparse: true,
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);

