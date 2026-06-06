const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide title"],
  },
  authors: {
    type: String,
    required: [true, "Please provide authors"],
  },
  university: {
    type: String,
    required: [true, "Please provide uiversity name"],
  },
  abstract: {
    type: String,
  },
  arxivId: {
    type: String,
  },
  category: {
    type: String,
  },
  doi: {
    type: String,
  },
  paper: {
    type: String,
  },
  date: {
    type: String,
  },
  citations: {
    type: Number,
  },
  likes: {
    type: Number,
  },
  downloads: {
    type: Number,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
