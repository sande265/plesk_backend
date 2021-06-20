const { createUser } = require('../users/userController');
const { login, forgotPassword } = require('./authController');
const router = require('express').Router();


router.post('/signin', login);
router.post('/signup', createUser)
router.patch('/change-password', forgotPassword)



module.exports = router