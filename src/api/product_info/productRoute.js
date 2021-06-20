const router = require('express').Router();
const { verifyToken } = require("../auth/token_validation")
const { createMovie, getMovies, getMovie, updateMovie, deleteMovie } = require('./productController')

router.post("/movies", verifyToken, createMovie);
router.get("/movies", verifyToken, getMovies);
router.get("/movies/:id", verifyToken, getMovie);
router.patch("/movies/:id", verifyToken, updateMovie);
router.delete("/movies/:id", verifyToken, deleteMovie)

module.exports = router