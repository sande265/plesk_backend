const { create, updateMovie, getMovie, getMovies, deleteMovie } = require('./productModel')

module.exports = {
    createMovie: (req, res) => {
        const body = req.body
        create(body, (err, result) => {
            if (err) return res.status(400).json({ message: err })
            return res.status(200).json({
                message: "Movie Created Successfully"
            })
        })
    },
    getMovies: (req, res) => {
        getMovies((err, result) => {
            if (err) return res.status(400).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`
            })
            return res.status(200).json({
                message: "Successfully Retrived Movies List",
                data: result
            })
        })
    },
    getMovie: (req, res) => {
        const id = req.params.id;
        getMovie(id, (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                    message: `${err.sqlMessage ? err.sqlMessage : 'Result Not Found.'}`
                })
            }
            if (result && result.length <= 0) {
                return res.status(400).json({
                    message: 'No Records Found'
                })
            }
            result[0].crew = JSON.parse(result[0].crew)
            result[0].directors = JSON.parse(result[0].directors)
            return res.status(200).json({
                message: "Successfully Retrived Movie Details",
                data: result,
            })
        })
    },
    updateMovie: (req, res) => {
        const id = req.params.id;
        const body = req.body;
        updateMovie(id, body, (err, result) => {
            if (err) return res.status(400).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`,
            })
            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'No Movie Found With the Given ID.'
                })
            }
            return res.status(200).json({
                message: "Successfully Updated Movie.",
                // data: result
            })
        })
    },
    deleteMovie: (req, res) => {
        const id = req.params.id;
        deleteMovie(id, (err, result) => {
            if (err) return res.status(400).json({
                message: `${err.sqlMessage ? err.sqlMessage : 'Something Went Wrong'}`
            })
            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: 'No Movie Found With Then Given ID',
                })
            }
            return res.status(200).json({
                message: "Movie Deleted Successfully",
                // data: result
            })
        })
    }
}