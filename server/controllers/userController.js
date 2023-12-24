const User = require("../models/User");
const Sharedposts = require("../models/Sharedposts");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");
const path = require("path");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select("-password");
  res.status(StatusCodes.OK).json({ user });

  console.log(req.signedCookies.token);
};

// update user's details
const updateUser = async (req, res) => {
  const { info, name } = req.body;
  const user = await User.findOne({ _id: req.user.userId });
  if (!info) {
    user.name = name;
  } else if (!name) {
    user.info = info;
  } else {
    user.info = info;
    user.name = name;
  }

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Success! " });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! password updated" });
};

// user's shared posts
const getUserPosts = async (req, res) => {
  const { id: userId } = req.params;
  console.log(req.params);

  try {
    const sharedposts = await Sharedposts.find({ user: userId });

    if (!sharedposts || sharedposts.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: `No shared posts found for user with ID: ${userId}`,
      });
    }

    res.status(StatusCodes.OK).json({ sharedposts, count: sharedposts.length });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const uploadImageprof = async (req, res) => {
  console.log(req.files);
  try {
    if (!req.files) {
      throw new CustomError.BadRequestError("No File Uploaded");
    }
    //get the user
    const user = await User.findById(req.user.userId);

    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }
    // get the uploaded image
    const profileImg = req.files.image;

    //type
    if (!profileImg.mimetype || !profileImg.mimetype.startsWith("image")) {
      throw new CustomError.BadRequestError("Uploaded file is not an image");
    }
    // size
    const maxSize = 1024 * 1024;

    if (profileImg.size > maxSize) {
      throw new CustomError.BadRequestError(
        "Please upload image smaller than 1MB"
      );
    }

    const imagePath = path.join(
      __dirname,
      "../public/uploads/" + `${profileImg.name}`
    );

    // Move the uploaded image to the specified path
    await profileImg.mv(imagePath);

    // Update the user's profileImg field with the image path
    user.profileImg = `/uploads/${profileImg.name}`;

    // Save the updated user
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ user, message: "Profile image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const uploadImageback = async (req, res) => {
  try {
    console.log(req.files);
    if (!req.files) {
      throw new CustomError.BadRequestError("No File Uploaded");
    }
    //get the user
    const user = await User.findById(req.user.userId);

    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }
    // get the uploaded image
    const backgroundImg = req.files.image;

    //type
    if (
      !backgroundImg.mimetype ||
      !backgroundImg.mimetype.startsWith("image")
    ) {
      throw new CustomError.BadRequestError("Uploaded file is not an image");
    }
    // size
    const maxSize = 1024 * 1024;

    if (backgroundImg.size > maxSize) {
      throw new CustomError.BadRequestError(
        "Please upload image smaller than 1MB"
      );
    }

    const imagePath = path.join(
      __dirname,
      "../public/uploads/" + `${backgroundImg.name}`
    );

    // Move the uploaded image to the specified path
    await backgroundImg.mv(imagePath);

    // Update the user's backgroundImg field with the image path
    user.backgroundImg = `/uploads/${backgroundImg.name}`;

    // Save the updated user
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ user, message: "Profile image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getUserPosts,
  uploadImageprof,
  uploadImageback,
};
