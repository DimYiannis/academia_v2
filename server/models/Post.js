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
  doi: {
    type: Number,
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
{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PostSchema.virtual('shares', {
  ref: 'Sharedposts',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

module.exports = mongoose.model("Post", PostSchema);
