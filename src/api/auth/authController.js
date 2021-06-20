const { compareSync, hashSync } = require("bcryptjs");
const { authenticate } = require("./authModel");
const jwt = require('jsonwebtoken');
const { updateUser } = require("../users/userModel");

module.exports = {
    login: (req, res) => {
        const body = req.body;
        if (!body.email) return res.status(400).json({ message: 'Email is Required.' })
        if (!body.password) return res.status(400).json({ message: 'Password is Required.' })
        authenticate(body.email, (err, result) => {
            if (err) return res.status(400).json({
                message: err
            })
            if (!result) return res.status(400).json({
                message: { email: ['Invalid Email Or Password.'], password: ['Invalid Email Or Password.'] }
            })
            const results = compareSync(body.password, result.password)
            if (result) {
                if (results === false) {
                    return res.status(400).json({
                        message: { email: ['Invalid Email Or Password.'], password: ['Invalid Email Or Password.'] }
                    })
                } else {
                    result.password = undefined;
                    const token = jwt.sign({ result: result }, process.env.JWT_SECRET, { expiresIn: '1h' },)
                    return res.status(200).json({
                        message: 'Logged In Successfully',
                        token: token,
                        token_type: 'Bearer'
                    })
                }
            }
        })
    },
    forgotPassword: (req, res) => {
        const { email, old_password, new_password } = req.body;
        if (!email) return res.status(400).json({ message: "email field is required" })
        if (!old_password) return res.status(400).json({ message: "Old Password Is Required." })
        if (!new_password) return res.status(400).json({ message: "New Password Is Required." })
        authenticate(email, (err, result) => {
            if (err) return res.status(400).json({
                message: err
            })
            if (!result) return res.status(400).json({
                message: { email: ['Invalid Email Or Password.'], password: ['Invalid Email Or Password.'] }
            })
            const results = compareSync(old_password, result.password)
            if (result) {
                if (results === false) {
                    return res.status(400).json({
                        message: { email: ['Invalid Email Or Password.'], password: ['Invalid Email Or Password.'] }
                    })
                } else {
                    result.password = undefined;
                    let data = { ...result }
                    data['password'] = hashSync(new_password, 10)
                    delete data['id']
                    updateUser(result.id, data, (err, result) => {
                        if (err) return res.status(400).json({ message: err })
                        return res.status(200).json({ message: "Password Changed Successfully" })
                    })
                }
            }
        })
    }
}