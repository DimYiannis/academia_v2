const Sharedposts = require("../models/Sharedposts");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createsharedpost = async (req, res) => {
  const { title, post: postId } = req.body;

  const dbPost = await Post.findOne({ _id: postId });

  if (!dbPost) {
    throw new CustomError.NotFoundError(`No post with id : ${postId}`);
  }

  const {
    title: postTitle,
    authors,
    university,
    abstract,
    doi,
    date,
    _id: postID,
  } = dbPost;

  const sharedpost = await Sharedposts.create({
    title,
    user: req.user.userId,
    sharedpostdetails: [
      {
        title: postTitle,
        authors,
        university,
        abstract,
        doi,
        date,
        post: postID,
      },
    ],
  });

  res.status(StatusCodes.CREATED).json(sharedpost);
};

// All shared posts for the feed
const getAllSharedposts = async (req, res) => {
  const sharedposts = await Sharedposts.find({});

  res.status(StatusCodes.OK).json({ sharedposts });
};

// search shared post
const getSharedpost = async (req, res) => {
  console.log(req.params);
  const { id: sharedpostId } = req.params;

  const sharedpost = await Sharedposts.findOne({ _id: sharedpostId });
  if (!sharedpost) {
    throw new CustomError.NotFoundError(`No post with id: ${sharedpostId}`);
  }

  res.status(StatusCodes.OK).json({ sharedpost });
};

// current user's shared posts
const getCurrentUserPosts = async (req, res) => {
  const sharedposts = await Sharedposts.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ sharedposts, count: sharedposts.length });
};



// update shared post
const updateSharedpost = async (req, res) => {
  const { id: sharedpostId } = req.params;

  try {
    // Find the shared post by ID
    const sharedpost = await Sharedposts.findById(sharedpostId);

    // Check if the shared post exists
    if (!sharedpost) {
      throw new CustomError.NotFoundError(`No post with id : ${sharedpostId}`);
    }

    // Check user permissions
    checkPermissions(req.user, sharedpost.user);

    // Update based on the request body
    sharedpost.title = req.body.title || sharedpost.title;
    sharedpost.sharedpostdetails =
      req.body.sharedpostdetails || sharedpost.sharedpostdetails;
    // Add more fields as needed

    // Save the updated shared post
    await sharedpost.save();

    // Send the updated shared post in the response
    res.status(StatusCodes.OK).json({ sharedpost });
  } catch (error) {
    // Handle validation errors or permission issues
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// Delete shared post
const deleteSharedpost = async (req, res) => {
  console.log(req.params);
  const { id: sharedpostId } = req.params;

  try {
    // find the post by id
    const sharedpost = await Sharedposts.findById(sharedpostId);
    //check if post exists
    if (!sharedpost) {
      throw new CustomError.NotFoundError(`No post with id: ${sharedpostId}`);
    }
    //check user permissions
    checkPermissions(req.user, sharedpost.user)

    // remove the post
    await sharedpost.remove()

    // success message
    res.status(StatusCodes.OK).json({ message: 'Shared post deleted successfully!' });

  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({error: error.message})
  }
};

module.exports = {
  getSharedpost,
  getCurrentUserPosts,
  updateSharedpost,
  createsharedpost,
  getAllSharedposts,
  deleteSharedpost,
  
};
