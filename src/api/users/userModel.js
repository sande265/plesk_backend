const pool = require("../../database/database")


module.exports = {
    create: (data, callback) => {
        pool.query(
            `INSERT into user(first_name, last_name, username, password, email, role, image )
                    values(?,?,?,?,?,?,?)`,
            [
                data.first_name,
                data.last_name,
                data.username,
                data.password,
                data.email,
                data.role ? data.role : 'user',
                data.image,
            ], (error, result) => {
                if (error) return callback(error)
                return (callback(null, result))
            }
        )
    },
    getUsers: callback => {
        pool.query(
            `SELECT id, first_name, last_name, username, email, role, image, created_at, updated_at from user`,
            [],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    getUserById: (id, callback) => {
        pool.query(
            `SELECT first_name, last_name, username, email, role, image from user where id = ?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    updateUser: (id, data, callback) => {
        const updated_at = new Date()
        updated_at.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
        pool.query(
            `UPDATE user set first_name=?, last_name=?, username=?, password=?, email=?, role=?, image=?, updated_at = ? where id = ?`,
            [
                data.first_name,
                data.last_name,
                data.username,
                data.password,
                data.email,
                data.role,
                data.image,
                updated_at,
                id
            ],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    deleteUser: (id, callback) => {
        pool.query(
            `DELETE from user where id = ?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    }
}