let mongoose = require("mongoose");
let router = require("express").Router();
let Post = mongoose.model("Post");
let auth = require("../auth");
let { OkResponse, BadRequestResponse } = require("express-http-response");

router.post("/new", auth.required, auth.user, (req, res, next) => {
  try {
    let post = new Post(req.body.post);
    post.by = req.user._id;
    post.save((err, post) => {
      if (err) return next(err);
      next(new OkResponse(post));
    })
  }
  catch (err) {
    console.log(err);
    next(new BadRequestResponse(err));
  }
});


router.get('/get/all', auth.required, auth.user, (req, res, next) => {
  Post.find({}).sort({ createdAt: -1 }).exec(
    (err, posts) => {
      if (err) return next(err);
      next(new OkResponse(posts.map(post => post.toJSONFor(req.user))));
    }
  );
})
router.put("/update/:postId", auth.required, auth.user, (req, res, next) => {
  try {
    const postId = req.params.postId;

    // Find the post by its ID
    Post.findById(postId, (err, post) => {
      if (err) return next(err);

      if (!post) {
        // Post not found
        return res.status(404).json({ message: "Post not found" });
      }

      // if (post.by.toString() !== req.user._id.toString()) {
      //   // Unauthorized: the current user is not the author of the post
      //   return res.status(403).json({ message: "You don't have permission to update this post" });
      // }

      // Only update the 'body' field of the post
      if (req.body.body) {
        post.body = req.body.body;
      }

      post.save((err, updatedPost) => {
        if (err) return next(err);
        next(new OkResponse(updatedPost.toJSONFor(req.user)));
      });
    });
  }
  catch (err) {
    console.log(err);
    next(new BadRequestResponse(err));
  }
});

router.get('/get/my', auth.required, auth.user, (req, res, next) => {
  try {
    Post.find({ by: req.user._id }).sort({ createdAt: -1 }).exec(
      (err, posts) => {
        if (err) return next(err);
        next(new OkResponse(posts));
      }
    );
  }
  catch (err) {
    console.log(err);
    next(new BadRequestResponse(err));
  }
})
router.delete('/delete/:postId', auth.required, auth.user, (req, res, next) => {
  try {
    const postId = req.params.postId;

    // Check if the post belongs to the user
    Post.findOne({ _id: postId, by: req.user._id }, (err, post) => {
      if (err) return next(err);
      if (!post) return next(new BadRequestResponse("You can't delete this post"));

      // If post exists and belongs to the user, delete it
      Post.findByIdAndDelete(postId, (err) => {
        if (err) return next(err);
        next(new OkResponse({ message: 'Post deleted successfully' }));
      });
    });
  }
  catch (err) {
    console.log(err);
    next(new BadRequestResponse(err));
  }
});
router.get('/get/:postId', auth.required, auth.user, (req, res, next) => {

  const postId = req.params.postId;
  Post.findById(postId).exec((err, post) => {
    if (err) return next(err);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    next(new OkResponse(post.toJSONFor(req.user)));
  });
});
router.post('/support/:id', auth.required, auth.user, (req, res, next) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) return next(err);
    if (!post) return next(new BadRequestResponse("Post not found"));

    let alreadySupported = post.supportBy.map((user, index) => {
      if (user._id.toString() === req.user._id.toString()) {
        return index;
      }
    });

    console.log("===============", alreadySupported);

    if (alreadySupported[0]) {
      post.supportBy.splice(alreadySupported[0], 1);
    }
    else {
      post.supportBy.push(req.user._id);
    }

    post.save((err, post) => {
      if (err) return next(err);
      next(new OkResponse(post));
    })

  })
})

router.get('/hot/topics', auth.required, auth.user, (req, res, next) => {
  Post.find({}, (err, posts) => {
    if (err) return next(err);
    posts.sort((a, b) => { return b.supportBy.length - a.supportBy.length; });
    let topPosts = posts.slice(0, 3);
    next(new OkResponse(topPosts));
  });
});

module.exports = router;
