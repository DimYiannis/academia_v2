const mongoose = require("mongoose");

const SingleSharedpostsSchema = mongoose.Schema({
 
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
  date: {
    type: String,
  },
});

const SharedpostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
     
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      
    },
    sharedpostdetails: [SingleSharedpostsSchema],
  },
  { timestamps: true }
);


// fetch user information
SharedpostSchema.pre("find", function (next) {
  this.populate("user", "name"); 
  next();
});


module.exports = mongoose.model("SharedPosts", SharedpostSchema);
