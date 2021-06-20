const pool = require("../../database/database")

module.exports = {
    create: (data, callback) => {
        pool.query(
            `INSERT into movies(name, slug, description, imdb_url, poster_img, crew, directors, rating, synopsis)
                value(?,?,?,?,?,?,?,?,?)`,
            [
                data.name,
                data.slug,
                data.description,
                data.imdb_url,
                data.poster_img,
                JSON.stringify(data.crew),
                JSON.stringify(data.directors),
                data.rating,
                data.synopsis,
            ], (error, result) => {
                if (error) return callback(error)
                return (callback(null, result))
            }
        )
    },
    getMovies: callback => {
        pool.query(
            `SELECT * from movies`,
            [], (error, result) => {
                if (error) return callback(error)
                return (callback(null, result))
            }
        )
    },
    getMovie: (id, callback) => {
        pool.query(
            `SELECT * from movies WHERE id=? || slug=?`,
            [id, id], (error, result) => {
                if (error) return callback(error)
                else {
                    return (callback(null, result))
                }
            }
        )
    },
    updateMovie: (id, data, callback) => {
        const updated_at = new Date()
        updated_at.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
        pool.query(
            `UPDATE movies SET name=?, description=?, imdb_url=?, poster_img=?, crew=?, directors=?, rating=?, synopsis=?, updated_at = ? WHERE id=?`,
            [
                data.name,
                data.description,
                data.imdb_url,
                data.poster_img,
                JSON.stringify(data.crew),
                JSON.stringify(data.directors),
                data.rating,
                data.synopsis,
                updated_at,
                id,
            ],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    deleteMovie: (id, callback) => {
        pool.query(
            `DELETE FROM movies WHERE id = ?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    }
}