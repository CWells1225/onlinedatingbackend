const router = require('express').Router();
const { auth } = require('./authorization');
//Models
const User = require('../models/User');
const {
    SERVER_ERROR,
    USER_NOT_FOUND,
    LIKED,
    DISLIKED,
    PROFILE_UPDATED,
    MATCHES,
    MATCHED,
    AVTAR_UPLOADED,
} = require('../constant');
const { updateProfileValidation, likeUserValidation, forgotPasswordValidation, friendsValidation } = require('../utilities/validation');
const { Uploader } = require("../utilities/helper");

router.put('/updateProfile', auth, async (req, res) => {

    const UserId = req.user._id;
    if (!UserId) {
        return res.status(400).json({ error: false, msg: USER_NOT_FOUND });
    }
    const body = req.body;
    //Validate Data
    const { error } = updateProfileValidation(body);
    if (error) return res.status(400).json({ error: true, msg: error.details[0].message });

    try {
        const user = await User.findOneAndUpdate({ _id: UserId }, body, { new: true });
        res.json({ error: false, msg: PROFILE_UPDATED, data: user });
    } catch (error) {
        res.status(500).json({ error: true, msg: SERVER_ERROR })
    }
})

router.get('/userData', auth, async (req, res) => {

    const USER = req.user;
    if (!USER) {
        return res.status(400).json({ error: false, msg: USER_NOT_FOUND });
    }
    try {
        let user = await User.find({ _id: USER._id });
        res.json({ error: false, data: user });
    } catch (error) {
        res.status(500).json({ error: true, msg: SERVER_ERROR })
    }
})

router.get('/userList', auth, async (req, res) => {

    const USER = req.user;
    if (!USER) {
        return res.status(400).json({ error: false, msg: USER_NOT_FOUND });
    }
    let users = await User.find({
        $and: [
            { _id: { $ne: USER._id } },
            { _id: { $nin: USER.likes } },
            { _id: { $nin: USER.dislikes } }
        ]
    });
    res.json(users)
});

router.post('/like', auth, async (req, res) => {

    const UserId = req.user._id;
    if (!UserId) {
        return res.status(400).json({ error: false, msg: USER_NOT_FOUND });
    }
    const body = req.body;
    //Validate Data
    const { error } = likeUserValidation(body);
    if (error) return res.status(400).json({ error: true, msg: error.details[0].message });

    try {
        //Check if already liked
        const data = await User.findOne({ _id: UserId, likes: body.user_id }, { likes: true });
        if (data) return res.json({ error: false, msg: LIKED, data })

        //Like user
        const user = await User.findOneAndUpdate({ _id: UserId }, { $push: { likes: body.user_id } }, { new: true, fields: { likes: true } });

        //Check if Matches
        const buddy = await User.findOne({ $and: [{ _id: body.user_id }, { likes: UserId }] });
        if (buddy) {
            await User.findOneAndUpdate({ _id: UserId }, { $push: { matches: body.user_id } });
            await User.findOneAndUpdate({ _id: body.user_id }, { $push: { matches: UserId } });
            return res.json({
                error: false,
                msg: MATCHED,
                matches: true,
                data: {
                    match_id: buddy._id,
                    name: buddy.name,
                    avatar: buddy.avatar
                }
            })
        }
        res.json({ error: false, msg: LIKED, data: user })
    } catch (error) {
        res.status(500).json({ error: true, msg: SERVER_ERROR })
    }
})

router.post('/dislike', auth, async (req, res) => {

    const UserId = req.user._id;
    if (!UserId) {
        return res.status(400).json({ error: false, msg: USER_NOT_FOUND });
    }
    const body = req.body;
    //Validate Data
    const { error } = likeUserValidation(body);
    if (error) return res.status(400).json({ error: true, msg: error.details[0].message });

    try {
        //Check if already liked
        const data = await User.findOne({ _id: UserId, dislikes: body.user_id }, { dislikes: true });
        if (data) return res.json({ error: false, msg: DISLIKED, data })

        const user = await User.findOneAndUpdate({ _id: UserId }, { $push: { dislikes: body.user_id } }, { new: true, fields: { dislikes: true } });
        res.json({ error: false, msg: DISLIKED, data: user })
    } catch (error) {
        res.status(500).json({ error: true, msg: SERVER_ERROR })
    }
})

router.get('/matches', auth, async (req, res) => {
    const UserId = req.user._id;
    if (!UserId) {
        return res.status(400).json({ error: false, msg: USER_NOT_FOUND });
    }
    try {
        const users = await User.find({ _id: { $in: req.user.matches } })
        res.json({ error: false, msg: MATCHES, data: users })
    } catch (error) {
        res.status(500).json({ error: true, msg: SERVER_ERROR })
    }
})

router.post('/uploadAvatar', auth, Uploader.single('avatar'), async (req, res) => {

    console.log("Router file > ", req.file);
    const UserId = req.user._id;
    if (!UserId) {
        return res.status(400).json({ error: false, msg: USER_NOT_FOUND });
    }

    try {
        const user = await User.findOneAndUpdate(
            { _id: UserId },
            { avatar: req.file.filename },
            {
                new: true,
                fields: {
                    avatar: true,
                }
            });
        res.json({ error: false, msg: AVTAR_UPLOADED, data: user });
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ error: true, msg: SERVER_ERROR })
    }
})

module.exports = router;