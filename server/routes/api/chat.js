let mongoose = require("mongoose");
let router = require("express").Router();
let Chat = mongoose.model("Chat");
let auth = require("../auth");
let {OkResponse, BadRequestResponse} = require("express-http-response");

router.post("/create", auth.required, auth.user, (req, res, next) => {
    try{
        Chat.findOne({
            $or: [
                {
                    $and: [
                        {user1: req.user._id},
                        {user2: req.body.user2}
                    ]
                }
            ]
        }, (err, chat) => {
            if (err) {
                return next(err);
            }
            if (chat) {
                return next(new OkResponse(chat));
            }

            else{
                let user1 = req.user._id;
                let user2 = req.body.user2;
                let chat = new Chat({
                    user1: user1,
                    user2: user2,
                });
    
                chat.save((err, chat) => {
                    if (err) {
                        return next(err);
                    }
                    next (new OkResponse(chat));
                });
            }
        })
    } catch (err) {
        console.log(err);
        next(err);
    }
})

router.get("/get/all", auth.required, auth.user, (req, res, next) => {
    Chat.find({
        $or: [
            {
                user1: req.user._id
            },
            {
                user2: req.user._id
            }
        ]
    }).sort({updatedAt: -1}).exec((err, chats) => {
        if (err) {
            return next(err);
        }
        console.log("chats>>",chats)
        next(new OkResponse(chats));
    })
})


router.post("/message", auth.required, auth.user, (req, res, next) => {
    Chat.findOne({_id: req.body.chatId}, (err, chat) => {
        if (err) {
            return next(err);
        }
        if (!chat) {
            return next(new BadRequestResponse("Chat not found"));
        }

        chat.messages.push({
            by: req.user._id,
            body: req.body.message
        });

        chat.save((err, chat) => {
            if (err) {
                return next(err);
            }

            next(new OkResponse(chat));
        })
    })
});

module.exports = router;