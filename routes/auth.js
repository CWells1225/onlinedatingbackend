const router = require('express').Router();
const User = require('../models/User');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const {
    SERVER_ERROR,
    USER_REGISTERED,
    EMAIL_EXISTS,
    WRONG_EMAIL_PASSWORD,
    LOGGED_IN,
    USER_ALREADY_REGISTERED,
    USER_NOT_EXIST
} = require('../constant');
const { registerValidation, loginValidation, userExistValidation } = require('../utilities/validation');
const ObjectId = mongoose.Types.ObjectId;

router.post('/register', async (req, res) => {

    const body = req.body;
    //Validate Data
    const { error } = registerValidation(body);
    if (error) return res.status(400).json({ error: true, msg: error.details[0].message });

    //Checking if the user is already in the database
    const emailExist = await User.findOne({ email: body.email });
    if (emailExist) return res.status(400).json({ error: true, msg: EMAIL_EXISTS })

    //Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(body.password, salt);
    body.password = hashPassword;
    body._id = new ObjectId();
    //Create a new user
    const user = new User(body)
    try {
        let data = await user.save();
        data = JSON.parse(JSON.stringify(data));
        delete data.password;
        //Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        data.access_token = token;
    return res.json({ error: false, msg: USER_REGISTERED, data });
    } catch (error) {
        console.log("register", error);
        res.status(500).json({ error: true, msg: SERVER_ERROR })
    }
});

//Login
router.post('/login', async (req, res) => {

    //Validate Data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error: true, msg: error.details[0].message });

    //Checking if the email exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: true, msg: WRONG_EMAIL_PASSWORD });

    //Password is correct
    const validPass = await bcryptjs.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ error: true, msg: WRONG_EMAIL_PASSWORD });

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    user.access_token = token
    res.json({ error: false, msg: LOGGED_IN, data: user })

})

router.post('/userExist', async (req, res) => {

    const body = req.body;
    //Validate Data
    const { error } = userExistValidation(body);
    if (error) return res.status(400).json({ error: true, msg: error.details[0].message });

    try {
        //Checking if the email exists
        const user = await User.findOne({ email: body.email });
        if (user) {
            return res.json({
                error: false,
                userExist: true,
                msg: USER_ALREADY_REGISTERED
            })
        } else {
            return res.json({ error: false, userExists: false, msg: USER_NOT_EXIST })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: SERVER_ERROR })
    }
})
module.exports = router;