import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	)
}
const connectDB = handler => async (req, res) => {
	if (mongoose.connections[0].readyState) {
	return handler(req, res, mongoose.connections[0]);
	}
	await mongoose.connect(MONGODB_URI, {	
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useNewUrlParser: true,
		serverSelectionTimeoutMS: 4000,
		server: {
			socketOptions: {
				socketTimeoutMS: 4000,
				connectTimeoutMS: 4000,
				connectionTimeout: 4000
			}
		}
	});
	return handler(req, res, mongoose.connections[0]);
};

export default connectDB;
