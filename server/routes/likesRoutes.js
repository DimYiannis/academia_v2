const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  createlike,
  getAllLikes,
  deleteLike,
  getUsersLikes
} = require("../controllers/likesController");

router
.route('/')
.post(authenticateUser, createlike)
.get(authenticateUser,getAllLikes )

router
.route('/:id')
.delete(authenticateUser,  deleteLike)

router.route('/:id/likes').get(getUsersLikes)

module.exports = router;