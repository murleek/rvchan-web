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
	default: Date.now
  },
  lastUpdateDate: {
	  type: Date,
	  default: Date.now
  },
  tags: [{type: String}]
});

mongoose.models = {};

const Boards = mongoose.model('boards', boards);

export default Boards;