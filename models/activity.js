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
	date: Date,
	rules: {
		"*": Boolean,
		canAddBoards: Boolean,
		canEditBoards: Boolean,
		canDeleteBoards: Boolean,
	}
});

mongoose.models = {};

const Activity = mongoose.model('Activity', activity);

export default Activity;