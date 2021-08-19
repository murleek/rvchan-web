import Board from "../../../models/board"
import connectDB from '../../../lib/connectDB'

export default connectDB(async (req, res) => {
    const {
      query: { id },
      method,
    } = req;
    switch (method) {
        case "GET":
            try {
                let board = await Board.findOne({title: id});
                if (!board) {
                    try {
                        board = await Board.findOne({_id: id});
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
                let oldBoard = await Board.findOne({title: id});
                if (!oldBoard) {
                    try {
                        oldBoard = await Board.findOne({_id: id});
                    } catch (e) {
                        
                    }
                }
                if (!oldBoard) res.status(404).json({success: false, error: "not found"});
                const newBoard = await Pet.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
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
            
            break
        default:
            res.status(405).json({ success: false, error: "method not allowed" })
    }
})