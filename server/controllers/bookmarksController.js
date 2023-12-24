const Bookmarks = require("../models/Bookmarks");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createbookmark = async (req, res) => {
  const { post: postId } = req.body;

  try {
    const existingbookmark = await Bookmarks.findOne({user: req.user.userId, post: postId});
    console.log('Existing Bookmark:', existingbookmark);
    if (existingbookmark) {
      await existingbookmark.remove();

      res.status(StatusCodes.OK).json({
        message: " Bookmark removed succesfully!",
      });
    } else {

      // find the post
    const dbPost = await Post.findOne({ _id: postId });

    // check if post exists
    if (!dbPost) {
      throw new CustomError.NotFoundError(`No post with id : ${postId}`);
    }

    // references to the user and the post
    const newBookmark = new Bookmarks({
      user: req.user.userId, 
      post: dbPost._id,
    });
    await newBookmark.save();

    // Include post details in the response
    res.status(StatusCodes.CREATED).json({
      message: "Bookmark created successfully",
      bookmark: {
        _id: newBookmark._id,
        user: newBookmark.user,
        post: newBookmark.post,
        createdAt: newBookmark.createdAt,
        updatedAt: newBookmark.updatedAt,
        // Include post details
        postDetails: {
          title: dbPost.title,
          authors: dbPost.authors,
          university: dbPost.university,
          abstract: dbPost.abstract,
          doi: dbPost.doi,
          date: dbPost.date,
        },
      },
    });
  }
  } catch (error) {
    // Handle validation errors or the post not being found
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// All bookmarks
const getAllBookmarks = async (req, res) => {
  try {
    // Fetch all bookmarks
    const bookmarks = await Bookmarks.find({ user: req.user.userId });

    // Iterate through bookmarks and include post details for each
    const bookmarksWithDetails = bookmarks.map(async (bookmark) => {
      // Fetch post details for each bookmark
      const postDetails = await Post.findOne({ _id: bookmark.post });

      return {
        _id: bookmark._id,
        user: bookmark.user,
        post: bookmark.post,
        createdAt: bookmark.createdAt,
        updatedAt: bookmark.updatedAt,
        postDetails:postDetails
        ? {
          title: postDetails.title,
          authors: postDetails.authors,
          university: postDetails.university,
          abstract: postDetails.abstract,
          doi: postDetails.doi,
          date: postDetails.date,
        }
        : null
      };
    });

    // Wait for all asynchronous operations to complete
    const resolvedBookmarks = await Promise.all(bookmarksWithDetails);

    res.status(StatusCodes.OK).json({ bookmarks: resolvedBookmarks });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// Delete bookmark
const deleteBookmark = async (req, res) => {
  console.log(req.params);
  const { id: bookmarkId } = req.params;

  try {
    // find the post by id
    const bookmark = await Bookmarks.findById(bookmarkId);
    //check if post exists
    if (!bookmark) {
      throw new CustomError.NotFoundError(`No post with id: ${bookmarkId}`);
    }
    //check user permissions
    checkPermissions(req.user, bookmark.user);

    // remove the Bookmark
    await bookmark.remove();

    // success message
    res
      .status(StatusCodes.OK)
      .json({ message: "Bookmark deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  createbookmark,
  getAllBookmarks,
  deleteBookmark,
};
