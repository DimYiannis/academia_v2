const mongoose = require("mongoose");

const LikeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

//  uniqueness based on user and post
LikeSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model("Likes", LikeSchema);
