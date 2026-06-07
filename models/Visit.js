import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        index: true
    },
    path: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['home', 'post', 'page', 'other'],
        required: true,
        index: true
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'refModel',
        index: true
    },
    refModel: {
        type: String,
        enum: ['Post', 'Page']
    },
    country: {
        type: String,
        default: 'Unknown',
        index: true
    },
    countryCode: {
        type: String,
        default: 'XX',
        index: true
    },
    city: {
        type: String,
        default: 'Unknown'
    },
    userAgent: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Avoid Mongoose Model compilation error on hot reload
if (mongoose.models.Visit) {
    delete mongoose.models.Visit;
}

export default mongoose.model('Visit', VisitSchema);
