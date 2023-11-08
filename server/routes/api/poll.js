let mongoose = require("mongoose");
let router = require("express").Router();
let Poll = mongoose.model("Poll");
let auth = require("../auth");
let {OkResponse, BadRequestResponse} = require("express-http-response");

router.post("/new", auth.required, auth.user, (req, res, next) => {
  try{
    let poll = new Poll(req.body.poll);
  poll.by = req.user._id;
  poll.save((err, poll) => {
    if (err) return next(err);
    next(new OkResponse(poll));
  })
  }
  catch(err){
    console.log(err);
    next(new BadRequestResponse(err));
  }
});

router.get('/get/all', (req, res, next) => {
  Poll.find({}).sort({ createdAt: -1 }).exec(
    (err, polls) => {
      if (err) return next(err);
      next(new OkResponse(polls));
    }
  );
})

router.get('/get/my', auth.required, auth.user, (req, res, next) => {
  Poll.find({by: req.user}).sort({ createdAt: -1 }).exec(
    (err, polls) => {
      if (err) return next(err);
      next(new OkResponse(polls));
    }
  );
})


module.exports = router;
