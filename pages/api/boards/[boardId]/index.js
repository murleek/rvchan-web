import Boards from "../../../../models/boards"
import Moderators from "../../../../models/moderators"
import Activity from "../../../../models/activity"
import connectDB from '../../../../lib/connectDB'

export default connectDB(async (req, res) => {
    const {
        query: { id },
        method,
        body,
    } = req;
    switch (method) {
        case "GET":
            try {
                let board = await Boards.findOne({title: id});
                if (!board) {
                    try {
                        board = await Boards.findOne({_id: id});
                    } catch (e) {

                    }
                }

                if (!board) res.status(404).json({success: false, error: "not found"});
                res.json({
                    success: true,
                    board: board
                })
            } catch (error) {
                res.status(500).json({ success: false, error: error.name + ': ' + error.message })
            }
            break

        case "PUT":
            try {
                let moderator = await Moderators.findOne({token: body.modToken}).lean();
                if (!moderator) {
                    res.status(403).json({success: false, error: "moderator not found"})
                }
                if (!moderator.rules['*'] && !moderator.rules.canEditBoards) {
                    res.status(403).json({success: false, error: "permission denied"})
                }
                let oldBoard = await Boards.findOne({title: id}).lean();
                if (!oldBoard) {
                    try {
                        oldBoard = await Boards.findOne({_id: id}).lean();
                    } catch (e) {

                    }
                }
                if (!oldBoard) res.status(404).json({success: false, error: "not found"});
                const newBoard = await Boards.findByIdAndUpdate(oldBoard, {...oldBoard, ...body.board, lastUpdate: Date.now}, {
                    new: true,
                    runValidators: true,
                }).lean();
	            const activity = await Activity.create({
		            byId: moderator._id,
		            success: true,
		            action: "boards:edit:"+oldBoard.title,
		            role: moderator.role,
	            })
                res.json({
                    success: true,
                    oldBoard: oldBoard,
                    newBoard: newBoard
                })
            } catch (error) {
                res.status(500).json({ success: false, error: error.name + ': ' + error.message })
            }
            break

        case "DELETE":
            try {
                console.log(body);
                let moderator = await Moderators.findOne({token: body.modToken}).lean();
                if (!moderator) {
                    return res.status(403).json({success: false, error: "moderator not found"})
                }
                if (!moderator.rules['*'] && !moderator.rules.canDeleteBoards) {
                    return res.status(403).json({success: false, error: "permission denied"})
                }
                let oldBoard = await Boards.findOne({title: id}).lean();
                if (!oldBoard) {
                    try {
                        oldBoard = await Boards.findOne({_id: id}).lean();
                    } catch (e) {

                    }
                }
                if (!oldBoard) return res.status(404).json({success: false, error: "not found"});
                await Boards.findByIdAndUpdate(oldBoard, {...oldBoard, disabled: true, lastUpdate: Date.now}, {
                    new: true,
                    runValidators: true,
                });
	            const activity = await Activity.create({
		            byId: moderator._id,
		            success: true,
		            action: "boards:delete:"+oldBoard.title,
		            role: moderator.role,
	            })
                res.json({
                    success: true,
                    deletedBoard: oldBoard
                })
            } catch (error) {
                res.status(500).json({ success: false, error: error.name + ': ' + error.message })
            }
            break
        default:
            res.status(405).json({ success: false, error: "method not allowed" })
    }
})