import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment'

autoIncrement.initialize(mongoose);

const posts = new mongoose.Schema({
    name: {
        type: String
    },
    num: {
        type: Number,
        required: true
    },
    mail: {
        type: String
    },
    admissionDate: {
        type: Date,
        default: Date.now
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        // required: true
    },
    content: {
        type: String,
        required: true
    },
    thread: {
        type: Number
    },
    files: [{type: String}]
});

mongoose.models = {};

const Posts = (board) => {
    posts.plugin(autoIncrement.plugin, {
        model: `${board}-posts`,
        field: 'id'
    })
    return mongoose.model(`${board}-posts`, posts);
}

export default Posts;