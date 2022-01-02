const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.auth = async (req, res, next) => {
    const token = extractToken(req);
    if (!token) return res.status(401).send('unauthorized');

    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        let user = await User.findById(data._id);
        req.user = user;
        next();
    } catch (error) {
        console.log("err", error)
        res.status(400).send('invalid token')
    }
}


const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}