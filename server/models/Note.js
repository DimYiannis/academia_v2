const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema(
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
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// One note per user per paper
NoteSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model("Note", NoteSchema);
