import mongoose from 'mongoose';

const threads = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    board: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    token: {
        type: Date,
        default: Date.now
    },
    files: [{type: String}]
});

mongoose.models = {};

const Threads = (board) => mongoose.model(`${board}-threads`, threads);

export default Threads;