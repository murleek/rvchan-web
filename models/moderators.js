import mongoose from 'mongoose';

const moderators = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdBy: String,
  creationDate: Date,
  rules: {
    "*": Boolean,
    canAddBoards: Boolean,
    canEditBoards: Boolean,
    canDeleteBoards: Boolean,
  }
});

mongoose.models = {};

const Moderators = mongoose.model('Moderators', moderators);

export default Moderators;