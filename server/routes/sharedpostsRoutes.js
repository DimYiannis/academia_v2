const express = require('express');
const router = express.Router();
const {
    authenticateUser,
  } = require('../middleware/authentication');

  const {
    getSharedpost,
    getCurrentUserPosts,
    updateSharedpost,
    createsharedpost,
    getAllSharedposts,
    deleteSharedpost
  } = require('../controllers/sharedpostsController');

  router
  .route('/')
  .post(authenticateUser, createsharedpost)
  .get(authenticateUser, getAllSharedposts)

  router.route('/mysharedposts').get(authenticateUser, getCurrentUserPosts)

  router
  .route('/:id')
  .get(authenticateUser, getSharedpost)
  .patch(authenticateUser, updateSharedpost)
  .delete(authenticateUser, deleteSharedpost )

  module.exports = router;