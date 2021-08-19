import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var board = new Schema({
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
  },
  tags: [{ type: String }]
});

mongoose.models = {};

var Board = mongoose.model('Board', board);

export default Board;