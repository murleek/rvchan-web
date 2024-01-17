import mongoose from 'mongoose';

const activity = new mongoose.Schema({
	byId: {
		required: true,
		type: String
	},
	success: {
	  type: Boolean,
	  required: true
	},
	action: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.models = {};

const Activity = mongoose.model('activity', activity);

export default Activity;