const pool = require("../../database/database")

module.exports = {
    authenticate: (email, callback) => {
        pool.query(
            `SELECT * from user where email = ?`,
            [email],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result[0])
            }
        )
    },
}