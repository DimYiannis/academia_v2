const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  createbookmark,
  getAllBookmarks,
  deleteBookmark,
} = require("../controllers/bookmarksController");

router
.route('/')
.post(authenticateUser, createbookmark)
.get(authenticateUser,getAllBookmarks )

router
.route('/:id')
.delete(authenticateUser,  deleteBookmark)

module.exports = router;