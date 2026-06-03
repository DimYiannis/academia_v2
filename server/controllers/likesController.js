const Like = require("../models/Likes");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createlike = async (req, res) => {
  const { post: postId } = req.body;

  try {
    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ user: req.user.userId, post: postId });
    console.log("Existing Like:", existingLike);
    if (existingLike) {
      // User has already liked the post, so unlike it
      await existingLike.remove();

      res.status(StatusCodes.OK).json({
        message: "Like removed successfully!",
      });
    } else {
      // User has not liked the post, so create a new like
      const dbPost = await Post.findOne({ _id: postId });

      if (!dbPost) {
        throw new CustomError.NotFoundError(`No post with id : ${postId}`);
      }

      const newLike = new Like({
        user: req.user.userId,
        post: dbPost._id,
      });
      await newLike.save();

      res.status(StatusCodes.CREATED).json({
        message: "Like created successfully!",
        like: {
          _id: newLike._id,
          user: newLike.user,
          post: newLike.post,
          createdAt: newLike.createdAt,
          updatedAt: newLike.updatedAt,
          // Include post details
          postDetails: {
            title: dbPost.title,
            authors: dbPost.authors,
            university: dbPost.university,
            abstract: dbPost.abstract,
            arxivId: dbPost.arxivId,
            category: dbPost.category,
            doi: dbPost.doi,
            date: dbPost.date,
          },
        },
      });
    }
  } catch (error) {
    //  validation errors or the post not being found
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};


// Shared projection for a Post → postDetails
const toDetails = (p) => p ? {
  title: p.title,
  authors: p.authors,
  university: p.university,
  abstract: p.abstract,
  arxivId: p.arxivId,
  category: p.category,
  doi: p.doi,
  date: p.date,
} : null;

// Build like-with-details for a set of likes using a single batched Post query
const attachDetails = async (likes) => {
  const postIds = likes.map(l => l.post);
  const posts = await Post.find({ _id: { $in: postIds } }).lean();
  const byId = {};
  for (const p of posts) byId[String(p._id)] = p;
  return likes.map(l => ({
    _id: l._id,
    user: l.user,
    post: l.post,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
    postDetails: toDetails(byId[String(l.post)]),
  }));
};

// All likes
const getAllLikes = async (req, res) => {
  try {
    const likes = await Like.find({ user: req.user.userId }).lean();
    const resolvedLike = await attachDetails(likes);
    res.status(StatusCodes.OK).json({ likes: resolvedLike });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// Delete like
const deleteLike = async (req, res) => {
  console.log(req.params);
  const { id: likeId } = req.params;

  try {
    // find the post by id
    const like = await Like.findById(likeId);
    //check if post exists
    if (!like) {
      throw new CustomError.NotFoundError(`No post with id: ${likeId}`);
    }
    //check user permissions
    checkPermissions(req.user, like.user);

    // remove the Bookmark
    await like.remove();

    // success message
    res
      .status(StatusCodes.OK)
      .json({ message: "Like deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const getUsersLikes = async (req, res) => {
  const { id: userId } = req.params;
  try {
    const likes = await Like.find({ user: userId }).lean();
    const resolvedLike = await attachDetails(likes);
    // Empty list is valid — return [] rather than 404
    res.status(StatusCodes.OK).json({ likes: resolvedLike });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

module.exports = {
  createlike,
  getAllLikes,
  deleteLike,
  getUsersLikes
};
