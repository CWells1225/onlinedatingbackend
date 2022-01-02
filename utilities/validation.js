const Joi = require('joi');

//Registration Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        fname: Joi.string().required(),
        lname: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        age: Joi.string().required(),
        gender: Joi.string().required(),
        lookingfor: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string()
    });
    return schema.validate(data);
}

//Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

//User Exist Validation
const userExistValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email()
    });
    return schema.validate(data);
}

//Update Profile Validation
const updateProfileValidation = (data) => {
    const schema = Joi.object({
        fname: Joi.string().required(),
        lname: Joi.string().required(),
        age: Joi.string().required(),
        gender: Joi.string().required(),
        aboutme: Joi.string(),
        lookingfor: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        address: Joi.string(),
        country: Joi.string()
    });
    return schema.validate(data);
}

//Like User Validation
const likeUserValidation = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required()
    });
    return schema.validate(data);
}
//Friends Validation
const friendsValidation = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.userExistValidation = userExistValidation;
module.exports.updateProfileValidation = updateProfileValidation;
module.exports.likeUserValidation = likeUserValidation;
module.exports.friendsValidation = friendsValidation;