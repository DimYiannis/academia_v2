const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({ role: "user" }).select("-password");

  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};

const getSinglePost = async (req, res) => {
  console.log(req.params);
  const { id: postId } = req.params;
//using doi as parameter
  const post = await Post.findOne({ doi: postId })

  if (!post) {
    throw new CustomError.NotFoundError(`No post with id : ${postId}`);
  }

  res.status(StatusCodes.OK).json({ post });
};

module.exports = {
  getAllPosts,
  getSinglePost,
};
