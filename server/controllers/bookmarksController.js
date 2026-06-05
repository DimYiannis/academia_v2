const Bookmarks = require("../models/Bookmarks");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions, resolvePost } = require("../utils");

const createbookmark = async (req, res) => {
  try {
    // Resolve to a Post — existing _id, or upsert from an arXiv/HF paper payload
    const dbPost = await resolvePost(req.body);
    if (!dbPost) {
      throw new CustomError.NotFoundError(`No post or paper provided`);
    }

    const existingbookmark = await Bookmarks.findOne({ user: req.user.userId, post: dbPost._id });
    if (existingbookmark) {
      await existingbookmark.remove();

      res.status(StatusCodes.OK).json({
        message: " Bookmark removed succesfully!",
      });
    } else {
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
          arxivId: dbPost.arxivId,
          category: dbPost.category,
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
    const bookmarks = await Bookmarks.find({ user: req.user.userId }).lean();

    // Batch-fetch all referenced posts in one query (avoid N+1)
    const postIds = bookmarks.map(b => b.post);
    const posts = await Post.find({ _id: { $in: postIds } }).lean();
    const byId = {};
    for (const p of posts) byId[String(p._id)] = p;

    const resolvedBookmarks = bookmarks.map(b => {
      const p = byId[String(b.post)];
      return {
        _id: b._id,
        user: b.user,
        post: b.post,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
        postDetails: p ? {
          title: p.title,
          authors: p.authors,
          university: p.university,
          abstract: p.abstract,
          arxivId: p.arxivId,
          category: p.category,
          doi: p.doi,
          date: p.date,
        } : null,
      };
    });

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
