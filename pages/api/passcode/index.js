import connectDB from '../../../lib/connectDB'
import Moderators from "../../../models/moderators";
import AES from 'crypto-js/aes';
import { serialize } from 'cookie';

export default connectDB(async (req, res) => {
    const {
        method,
    } = req;
    const query = !req.body ? req.query : req.body;
    console.log(query);
    switch (method) {
        case 'GET':
            try {
                if (query.token) {
                    if (query.hasOwnProperty("moderator")) {
                        let moderator = await Moderators.findOne({token: query.token}).lean();
                        if (!moderator) {
                            res.status(403).json({success: false, error: "moderator not found"})
                        }
                        if (moderator.disabled) {
                            res.status(403).json({success: false, error: "permission denied"})
                        }
                        res.setHeader('Set-Cookie', serialize(
                            "mod_token",
                            AES.encrypt(moderator.token, process.env.SALT),
                            {
                                secure: true,
                                maxAge: 30 * 24 * 60 * 60 * 1000,
                                signed: true
                            }
                        )).json({
                            success: true,
                            role: moderator.role,
                            name: moderator.name,
                            rules: moderator.rules
                        })
                    } else {

                        let passcode = await Passcodes.findOne({token: query.token}).lean();
                        if (!passcode) {
                            res.status(403).json({success: false, error: "passcode not found"})
                        }
                        if (passcode.disabled) {
                            res.status(403).json({success: false, error: "permission denied"})
                        }

                        res.json({success: true})
                    }
                } else {
                    res.status(403).json({success: false, error: "you need to provide a token"});
                }
            } catch (error) {
                res.status(500).json({ success: false, error: error.name + ': ' + error.message })
            }
            break;
        default:
            res.status(405).json({ success: false, error: "method not allowed" })
    }
})