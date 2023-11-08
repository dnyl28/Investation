const emailVerifyTemplate = (user) => {
    return `
      Your OTP is ${user.otp}
    `
}
module.exports = {emailVerifyTemplate}