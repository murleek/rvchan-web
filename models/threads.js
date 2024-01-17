import mongoose from 'mongoose';

const threads = new mongoose.Schema({
  name: {
    type: String,
  },
  title: {
    type: String,
    required: true
  },
  token: {
    type: String,
//    required: true
  },
  id: {
    type: Number,
    required: true
//    required: true
  },
  options: {
    canPostImages: Boolean,
    isPinned: Boolean,
  }
});

mongoose.models = {};


const Threads = (board) => {
  return mongoose.model(`${board}-threads`, threads);
}
export default Threads;