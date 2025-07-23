import { Schema, model } from 'mongoose';

const drawingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optionnel
    },
    canvasData: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isImmortalized: {
        type: Boolean,
        default: false,
    },
});

const Drawing = model('Drawing', drawingSchema);

export default Drawing;