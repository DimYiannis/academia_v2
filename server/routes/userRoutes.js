const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions
} = require('../middleware/authentication');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  uploadImageprof,
  uploadImageback,
} = require('../controllers/userController');

router
  .route('/')
  .get(authenticateUser,authorizePermissions('admin','owner'), getAllUsers);

router.route('/showUser').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

router.route('/:id').get(authenticateUser, getSingleUser,);

router.route('/uploadprofimage').post(authenticateUser, uploadImageprof);
router.route('/uploadbackimage').post(authenticateUser, uploadImageback);

module.exports = router;
