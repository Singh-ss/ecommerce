const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController');
const { isAuthenticatedUser, isAuthorizedUser } = require('../middleware/authUser');

router.route('/register')
    .post(registerUser);

router.route('/login')
    .post(loginUser);

router.route('/logout')
    .get(logout);

router.route('/password/forgot')
    .post(forgotPassword);

router.route('/password/reset/:token')
    .put(resetPassword);

router.route('/me')
    .get(isAuthenticatedUser, getUserDetails);

router.route('/password/update')
    .put(isAuthenticatedUser, updatePassword);

router.route('/me/update')
    .put(isAuthenticatedUser, updateProfile);

router.route('/admin/users')
    .get(isAuthenticatedUser, isAuthorizedUser('admin'), getAllUsers);

router.route('/admin/user/:id')
    .get(isAuthenticatedUser, isAuthorizedUser('admin'), getSingleUser)
    .put(isAuthenticatedUser, isAuthorizedUser('admin'), updateUserRole)
    .delete(isAuthenticatedUser, isAuthorizedUser('admin'), deleteUser);

module.exports = router;