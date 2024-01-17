import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment'

autoIncrement.initialize(mongoose);

const posts = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    filesize: {
        type: Number,
        required: true
    },
    fileid: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    thumbpath: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    id: {
        type: Number,
        required: true
    }
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