const pool = require("../../database/database")
const nodemailer = require('nodemailer')

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
    sendResetEmail: (email, password, name, callback) => {
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: "emaildeliverysande@gmail.com",
                pass: process.env.MAIL_PASS
            }
        })
        var mailOptions = {
            from: 'no-reply',
            to: email,
            subject: 'About Password Reset.',
            html: `
                <h1>Password Reset Notification</h1>
                <p>Hello ${name},<p>
                <p>We have received a request to reset your password for your account.<br />
                The password for your account is ${password},<br />
                Thank you.</p><br />
                <br />
                <p>&copy; 2021 Sandesh Singh, All Rights Reserved</p>
            `
        };
        transporter.sendMail(mailOptions, (err, result) => {
            if (err) return callback(err)
            return callback(null, result)
        })
    }
}