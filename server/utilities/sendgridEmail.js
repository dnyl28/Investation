const nodemailer = require('nodemailer');
let { emailVerifyTemplate, forgotPasswordTemplate } = require('./emailTemplate');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'haseebsaqib20@gmail.com',
    clientId: ' 756946341802-argagun5vdtvnlhcfilbbf4b0j7sep78.apps.googleusercontent.com',
    clientSecret: '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',
    // accessToken: "ya29.a0AfB_byDYbHRYAiKg4be98BRBaXXAQ0PaU-y9zXfciMDZX2aAGrmTZDrRm4OLNMDdGzkD6h-NpxMUoo7RNpyNRYMIDgiA2gM4jdQoEwgp2krfLa9_eDpc-AwzzFjbHDtX8yxpD-ARGKo887paOvEiGk2MmhFxKGWqxzsxaCgYKAXwSARMSFQHGX2Mi4V0v2aL3xvH3SQMT4X_OiQ0171",
    refreshToken: '1//04IhaWLfYiZ_UCgYIARAAGAQSNwF-L9IrnATtea8fIQVGsPhc7gv82HHUGOsO5fi409vnxxpkCnZUsIFEJuZfRa2KLfMvqOaA_6U',

  }
});

const sendEmailOtpMail = async (user) => {
  const mailOptions = {
    from: 'noreply@easyoz.com.au',
    to: user.email,
    subject: 'Email Verification',
    text: 'Email Verification',
    
    html: emailVerifyTemplate(user)
  };
  console.log('mail options::::::', mailOptions)
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendEmailOtpMail };
