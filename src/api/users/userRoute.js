const { createUser, getUserById, getUsers, updateUser, deleteUser } = require('./userController');
const router = require('express').Router();
const { verifyToken } = require("../auth/token_validation")

router.post("/users", verifyToken, createUser);
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.patch("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser)


module.exports = router