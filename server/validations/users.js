const { check } = require('express-validator');

let {InternalServerErrorResponse  ,BadRequestResponse } =  require('express-http-response');

const registerEmail = [
    check('user.fullName').not().isEmpty(),
    check('user.email').not().isEmpty().isEmail(),
    check('user.password').not().isEmpty(),
]
const loginEmail = [
    check('user.email').not().isEmpty().isEmail(),
    check('user.password').not().isEmpty(),
]
const loginPhone = [
    check('user.phone').not().isEmpty(),
]
const registerPhone = [
    check('user.phone').not().isEmpty(),
    check('user.fullName').not().isEmpty(),
]
const verifyPhone = [
    check('user.phone').not().isEmpty(),
    check('user.otp').not().isEmpty(),
];
const verifyEmail = [
    check('user.email').not().isEmpty(),
    check('user.otp').not().isEmpty(),
];

const createAdmin = [
    check('user.fullName').not().isEmpty(),
    check('user.email').not().isEmpty().isEmail(),
]

module.exports = {
    registerEmail,
    loginEmail,
    loginPhone,
    registerPhone,
    verifyPhone,
verifyEmail,
createAdmin,
}