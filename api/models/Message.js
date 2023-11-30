import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    recepientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    messageType: {
        type: String,
        enum: ['text', 'image'],
    },
    messageText: String,
    imageUrl: String,
    timeStamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Messages', messageSchema);
