let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
let ChatSchema = new mongoose.Schema(
	{
        user1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        user2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        messages: [
            {
                body: { type: String },
                by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            }
        ]
	},
	{ timestamps: true }
);

ChatSchema.plugin(uniqueValidator, { message: "is already taken." });
ChatSchema.plugin(mongoosePaginate);


var autoPopulate = function (next) {
    this.populate("user1");
    this.populate("user2");
    this.populate("messages.by");
	next();
};

ChatSchema.pre("findOne", autoPopulate);
ChatSchema.pre("find", autoPopulate);


ChatSchema.methods.toJSON = function () {
	return {
    _id: this._id,
    user1: this.user1,
    user2: this.user2,
    messages: this.messages,
	};
};

module.exports = mongoose.model("Chat", ChatSchema);
