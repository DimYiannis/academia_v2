const Note = require("../models/Note");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { resolvePost } = require("../utils");

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

// Create or update the user's note for a paper. Body: { post|arxivId, ...paper, content }
const upsertNote = async (req, res) => {
  try {
    const { content } = req.body;
    const dbPost = await resolvePost(req.body);
    if (!dbPost) throw new CustomError.NotFoundError("No post or paper provided");

    const note = await Note.findOneAndUpdate(
      { user: req.user.userId, post: dbPost._id },
      { content: content || "" },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(StatusCodes.OK).json({
      message: "Note saved",
      note: { _id: note._id, post: note.post, content: note.content, updatedAt: note.updatedAt },
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// All notes for the current user, with paper details
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId }).lean();
    const postIds = notes.map(n => n.post);
    const posts = await Post.find({ _id: { $in: postIds } }).lean();
    const byId = {};
    for (const p of posts) byId[String(p._id)] = p;

    const result = notes.map(n => ({
      _id: n._id,
      post: n.post,
      content: n.content,
      updatedAt: n.updatedAt,
      postDetails: toDetails(byId[String(n.post)]),
    }));
    res.status(StatusCodes.OK).json({ notes: result });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// Note for one paper — by Post _id or arxivId
const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    let post = await Post.findById(id).lean().catch(() => null);
    if (!post) post = await Post.findOne({ arxivId: id }).lean();
    if (!post) return res.status(StatusCodes.OK).json({ note: null });

    const note = await Note.findOne({ user: req.user.userId, post: post._id }).lean();
    res.status(StatusCodes.OK).json({ note: note || null });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, user: req.user.userId });
    if (!note) throw new CustomError.NotFoundError(`No note with id: ${id}`);
    await note.remove();
    res.status(StatusCodes.OK).json({ message: "Note deleted" });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = { upsertNote, getAllNotes, getNote, deleteNote };
