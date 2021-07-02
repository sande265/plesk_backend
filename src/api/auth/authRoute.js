const { createUser } = require('../users/userController');
const { login, resetPassword, changePassword } = require('./authController');
const router = require('express').Router();


router.post('/signin', login);
router.post('/signup', createUser)
router.patch('/change-password', changePassword)
router.post('/reset', resetPassword)



module.exports = router