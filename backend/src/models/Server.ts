import { Schema, model } from 'mongoose';

const serverSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    players: [String],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    drawings: [{
        type: Schema.Types.ObjectId,
        ref: 'Drawing'
    }],
    maxPlayers: {
        type: Number,
        required: true,
        default: 8
    }
});

const Server = model('Server', serverSchema);

export default Server;