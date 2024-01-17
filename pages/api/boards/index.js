import connectDB from '../../../lib/connectDB'
import Posts from "../../../models/posts";
import Moderators from "../../../models/moderators";
import Activity from "../../../models/activity";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import Boards from "../../../models/boards";

export default connectDB(async (req, res) => {
	const {
		method,
		body,
	} = req;
	body.modToken = AES.decrypt(req.cookies.mod_token, process.env.SALT).toString(CryptoJS.enc.Utf8);
	switch (method) {
		case 'GET':
			try {
			res.json({
				name: "rvchan",
				boards: await Boards.find()
			})
			} catch (error) {
				res.status(500).json({ success: false, error: error.name + ': ' + error.message })
			}
			break;

		case 'POST':
			try {
				let moderator = await Moderators.findOne({token: body.modToken}).lean();
				if (!moderator) {
					return res.status(403).json({success: false, error: "moderator not found"})
				}
				if (!moderator.rules['*'] && !moderator.rules.canAddBoards) {
					return res.status(403).json({success: false, error: "permission denied"})
				}
				const oldBoard = await Boards.findOne({title: body.board.title});
				if (oldBoard) {
					return res.status(400).json({success: false, error: "this board exists"})
				}
				const board = await Boards.create(req.body.board)
				const activity = await Activity.create({
					byId: moderator._id,
					success: true,
					action: "boards:add",
					role: moderator.role,
				})
				console.log(activity);
				res.status(201).json({ success: true, board: board })
			} catch (error) {
				res.status(500).json({ success: false, error: error.name + ': ' + error.message })
			}
			break;
		default:
			res.status(405).json({ success: false, error: "method not allowed" })
	}
})