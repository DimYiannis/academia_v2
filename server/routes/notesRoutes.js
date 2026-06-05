const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  upsertNote,
  getAllNotes,
  getNote,
  deleteNote,
} = require("../controllers/notesController");

router
  .route("/")
  .post(authenticateUser, upsertNote)
  .get(authenticateUser, getAllNotes);

router
  .route("/:id")
  .get(authenticateUser, getNote)
  .delete(authenticateUser, deleteNote);

module.exports = router;
