let mongoose = require("mongoose");
let router = require("express").Router();
let passport = require("passport");
require("../../models/User");
let auth = require("../auth");
let { OkResponse, BadRequestResponse } = require("express-http-response");
let { sendEmailOtpMail } = require('../../utilities/sendgridEmail');
const { log } = require("handlebars");


const User = mongoose.model("User");
// router.post('/signup', (req, res, next) => {

//   // const user = new User(req.body.user);
//   // user.setPassword(req.body.user.password);
//   // user.save((err, user)=>{
//   //   if(err){
//   //     return next(new BadRequestResponse(err));
//   //   }

//   //   console.log(" userrrrr >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
//   //   res.json(new OkResponse("User created"));
//   // });


//   // Check if a user with the same username or email already exists
//   User.findOne({ email: req.body.user.email }, (err, existingUser) => {
//     if (err) {
//       return next(new BadRequestResponse(err));
//     }

//     if (existingUser) {
//       // User with the same email already exists; return an error message
//       console.log("User with this email already exists>>>")
//       return res.status(400).json({ message: 'User with this email already exists' });
//     }

//     // If no existing user is found, create and save the new user
//     const user = new User(req.body.user);
//     user.setPassword(req.body.user.password);
//     user.save((err, savedUser) => {
//       if (err) {
//         return next(new BadRequestResponse(err));
//       }

//       console.log("User created");
//       res.json({ message: 'User created' });
//     });
//   });

// })
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body.user;
    console.log('email is::::', email)
    console.log('email is::::', req.body.user.email)
    console.log('email is::::', req.body.user)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await new User(req.body.user);
    user.setPassword(password);
    // Generate and set OTP here
    user.setOTP();
    await user.save();
    // Send OTP email
    await sendEmailOtpMail(user);

    return res.status(201).json({ message: 'User created. Please check your email for verification OTP.', success: 'true' });
  } catch (err) {
    return next(new BadRequestResponse(err));
  }
});


router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      console.log(err, user, info)
      if (err || !user) {
        return next(new BadRequestResponse(err));

      }
      if (user.verified == false) {
        return res.status(401).json({ message: "Account is not verified. Please check your email for the OTP." });
      }
      if (user) {
        next(new OkResponse(user.toAuthJSON()));
      }
    },
  )(req, res, next);
})

router.put('/profile', auth.required, auth.user, (req, res, next) => {

  req.user.fullName = req.body.user.fullName || req.user.fullName;
  req.user.state = req.body.user.state || req.user.state;
  req.user.city = req.body.user.city || req.user.city;
  req.user.postalCode = req.body.user.postalCode || req.user.postalCode;

  req.user.save((err, user) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    return next(new OkResponse(user));
  })
})

router.get('/me', auth.required, auth.user, (req, res, next) => {
  try {

    User.findOne({ by: req.user._id }).exec(
      (err, user) => {
        if (err) return next(err);
        next(new OkResponse(user));
      }
    );
  }
  catch (err) {
    console.log(err);
    next(new BadRequestResponse(err));
  }
});

// router.post('/send/otp', (req, res, next) => {
//   sendEmailOtpMail('frazakhtar563@gmail.com');

// })

// router.post('/verify/otp', (req, res, next) => {
//   User.findOne({ email: req.body.email }, (err, user) => {
//     if (err) {
//       return next(new BadRequestResponse(err));
//     }
//     if (!user) {
//       return next(new BadRequestResponse("User not found"));
//     }
//     if (user.otp !== req.body.otp) {
//       return next(new BadRequestResponse("OTP not matched"));
//     }
//     if (user.otpExpires < Date.now()) {
//       return next(new BadRequestResponse("OTP expired"));
//     }
//     user.otp = null;
//     user.otpExpires = null;
//     user.save((err, user) => {
//       if (err) {
//         return next(new BadRequestResponse(err));
//       }
//       return next(new OkResponse("OTP verified"));
//     })
//   });
// });
router.post('/verify/otp', async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "OTP not matched" });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: "OTP verified, account activated." });
  } catch (err) {
    return next(new BadRequestResponse(err));
  }
});

router.post('/change/password', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    if (!user) {
      return next(new BadRequestResponse("User not found"));
    }
    user.setPassword(req.body.password);
    user.save((err, user) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return next(new OkResponse("Password changed"));
    })
  });
})

router.get('/context', auth.required, auth.user, (req, res, next) => {
  return next(new OkResponse(req.user.toAuthJSON()));
})

module.exports = router;
