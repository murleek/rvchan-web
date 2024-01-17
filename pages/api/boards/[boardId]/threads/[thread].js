import Posts from "../../../../../models/posts"
import Moderators from "../../../../../models/moderators"
import Activity from "../../../../../models/activity"
import connectDB from '../../../../../lib/connectDB'
import Boards from "../../../../../models/boards";
import testRecaptcha from "../../../../../utils/recaptcha";
import Threads from "../../../../../models/threads";
import formidable from "formidable";
import FTPClient from "ftp";

export const config = {
    api: {
        bodyParser: false
    }
};

export default connectDB(async (req, res) => {
    const {
        query: { boardId, thread },
        method,
        body,
    } = req;
    switch (method) {
        case "GET":
            try {
                let board = await Boards.findOne({title: boardId});
                if (!board) {
                    try {
                        board = await Boards.findOne({_id: boardId});
                    } catch (e) {

                    }
                }
                if (!board) return res.status(404).json({success: false, error: "not found"});

                let threadPost = await Posts(board.title).findOne({id: thread}).lean();
                if (!threadPost) return res.status(404).json({success: false, error: "not found"});

                let threadOp = await Threads(board.title).findOne({id: thread}).lean();

                let posts = await Posts(board.title).find({thread: thread}).lean();
                let postCount = await Posts(board.title).find({thread: thread}).count();

                return res.json({
                    success: true,
                    thread: {...threadOp, posts, postCount, post: threadPost}
                })
            } catch (error) {
                res.status(500).json({ success: false, error: error.name + ': ' + error.message })
            }
            break

        case "PUT":
            try {
                let board = await Boards.findOne({title: boardId}).lean();
                if (!board) {
                    try {
                        board = await Boards.findOne({_id: boardId}).lean();
                    } catch (e) {

                    }
                }
                if (!board) res.status(404).json({success: false, error: "not found"});
                const newBoard = await Boards.findByIdAndUpdate(oldBoard, {...oldBoard, ...body.board, lastUpdate: Date.now}, {
                    new: true,
                    runValidators: true,
                }).lean();
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
                let oldBoard = await Boards.findOne({title: boardId}).lean();
                if (!oldBoard) {
                    try {
                        oldBoard = await Boards.findOne({_id: boardId}).lean();
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
        case 'POST':
            try {
                const form = new formidable.IncomingForm({
                    multiples: true,
                    maxFileSize: 16*1024*1024,
                    filter: ({mimetype}) => 
                        mimetype && mimetype.includes("image")
                });
                form.parse(req, async function (err, fields, files) {
                    console.log(err);
                    console.log(fields);
                    console.log(files);
                    return res.status(500).json({ success: true, fields, files: files.f });

                    try {
                        await testRecaptcha(fields["g-recaptcha-token"]);
                    } catch (error) {
                        return res.status(500).json({ success: false, error: "captcha error: " + error.message });
                    }

                    let board = await Boards.findOne({ title: boardId });
                    if (!board) {
                        try {
                            board = await Boards.findOne({ _id: boardId });
                        } catch (e) {
                        }
                    }
                    let threadPost = await Posts(board.title).findOne({ id: thread });
                    if (!threadPost)
                        res.status(404).json({ success: false, error: "not found" });

                    let posts = await Posts(board.title).find({ thread: thread }).lean();

                    if (files) {
                        var config = {
                            host: process.env.FTP_HOST,
                            port: process.env.FTP_PORT,
                            user: process.env.FTP_USER,
                            password: process.env.FTP_PASSWORD
                        }, client = new FTPClient();

                        client.on('ready', function () {
                            c.put('foo.txt', 'foo.remote-copy.txt', function (err) {
                                if (err)
                                    throw err;
                                c.end();
                            });
                            files.forEach((e) => {
                            });
                        });
                        c.connect(config);

                        client.connect(function () {
                            client.upload(['test/**'], '/static/images', {
                                overwrite: 'all'
                            }, function (result) {
                                console.log(result);
                            });

                        });
                    }

                    let newPost = await Posts(board.title).create({
                        thread: thread,
                        content: fields.c,
                        date: Date.now(),
                        mail: fields.m,
                        num: (posts[posts.length - 1]?.num ?? 1) + 1
                    });

                    res.status(201).json({ success: true, post: newPost });
                })
            } catch (error) {
                res.status(500).json({ success: false, error: error.name + ': ' + error.message })
            }
            break
        default:
            res.status(405).json({ success: false, error: "method not allowed" })
    }
})