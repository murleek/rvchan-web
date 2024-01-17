import connectDB from '../../../../../lib/connectDB'
import Posts from "../../../../../models/posts";
import Moderators from "../../../../../models/moderators";
import Activity from "../../../../../models/activity";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import Threads from "../../../../../models/threads";
import Boards from "../../../../../models/boards";
import testRecaptcha from "../../../../../utils/recaptcha";

export default connectDB(async (req, res) => {
    const {
        query: { boardId },
        method,
        body,
    } = req;
    switch (method) {
        case 'GET':
            try {
                res.json({
                    name: "rvchan",
                    threads: await Threads(boardId).find()
                })
            } catch (error) {
                res.status(500).json({ success: false, error: error.name + ': ' + error.message })
            }
            break;
        case 'POST':
            try {
                console.log(body)
                if (body.captcha.type === "recaptcha") {
                    await testRecaptcha(body.captcha.token)
                }
                let post = body.post
                let board = await Boards.findOne({title: boardId});
                if (!board) {
                    try {
                        board = await Boards.findOne({_id: boardId});
                    } catch (e) {

                    }
                }
                if (!board) res.status(404).json({success: false, error: "not found"});

                let newPost = await Posts(board.title).create({
                    content: post.content.text,
                    date: Date.now(),
                    mail: post.mail,
                    num: 1
                })
                let title = post.content.text.match(/^(.*?[?!.]?[^\r\n])(?=\s*[A-ZА-ЯЁ]|\r\n|\n|$)/gm)[0];

                const thread = await Threads(boardId).create({
                    title: title.substr(0, 48) + (title.length > 48 ? "..." : ""),
                    options: {
                        canPostImages: false
                    },
                    id: newPost._doc.id
                })
                let threadRet = {...thread._doc, ...newPost._doc};
                delete threadRet.__v;
                delete threadRet._id;
                res.status(201).json({ success: true, thread:  threadRet})
            } catch (error) {
                res.status(500).json({ success: false, error: error.name + ': ' + error.message })
            }
            break
        default:
            res.status(405).json({ success: false, error: "method not allowed" })
    }
})