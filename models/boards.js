import mongoose from 'mongoose';

export const BOARD_NAME_LENGTH = 12;

const boards = new mongoose.Schema({
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
  lastUpdateDate: {
    type: Date,
  },
  tags: [{type: String}]
});

mongoose.models = {};

const Boards = mongoose.model('Boards', boards);

export default Boards;