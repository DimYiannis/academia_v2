const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    
} = require('../middleware/authentication')

const {
    getAllPosts,
    getSinglePost
} = require('../controllers/postsContoller')

router
.route('/')
.get(authenticateUser,getAllPosts);

router.route('/:id').get(authenticateUser,getSinglePost)

module.exports = router;
