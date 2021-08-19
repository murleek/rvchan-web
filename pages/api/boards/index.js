import Board from "../../../models/board"
import connectDB from '../../../lib/connectDB'

export default connectDB(async (req, res) => {
    res.json({
        name: "rvchan",
        boards: await Board.find()
    })
})