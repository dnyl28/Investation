let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
let PostSchema = new mongoose.Schema(
  {

    body: {
      type: String,
      required: true,
    },

    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    images: [
      {
        name: String,
        url: String,
      }
    ],
    supportBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true }
);

PostSchema.plugin(uniqueValidator, { message: "is already taken." });
PostSchema.plugin(mongoosePaginate);


var autoPopulate = function (next) {
  this.populate("by");
  this.populate("supportBy");
  next();
};

PostSchema.pre("findOne", autoPopulate);
PostSchema.pre("find", autoPopulate);


PostSchema.methods.toJSON = function () {
  return {
    _id: this._id,
    body: this.body,
    by: this.by,
    images: this.images,
    supportBy: this.supportBy,
    supportCount: this.supportBy.length,
    createdAt: this.createdAt,
  };
};

PostSchema.methods.toJSONFor = function (user) {
  console.log("============", user._id, this.supportBy);
  return {
    _id: this._id,
    body: this.body,
    by: this.by,
    images: this.images,
    supportBy: this.supportBy,
    supportCount: this.supportBy.length,
    isSupported: this.supportBy.some(u => u._id.toString() === user._id.toString()),
    createdAt: this.createdAt,
  };
};



module.exports = mongoose.model("Post", PostSchema);
