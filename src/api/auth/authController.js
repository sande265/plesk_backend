const { compareSync, hashSync } = require("bcryptjs");
const { authenticate, sendResetEmail } = require("./authModel");
const jwt = require('jsonwebtoken');
const { updateUser } = require("../users/userModel");

module.exports = {
    login: (req, res) => {
        const body = req.body;
        if (!body.email) return res.status(400).json({ message: { email: ['Email field is required'] } })
        if (!body.password) return res.status(400).json({ message: { password: ['Password field is required'] } })
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
    changePassword: (req, res) => {
        const { email, old_password, new_password } = req.body;
        if (!email) return res.status(400).json({ message: { email: ['Email is required'] } })
        if (!old_password) return res.status(400).json({ message: { old_password: ['Old Password is required'] } })
        if (!new_password) return res.status(400).json({ message: { new_password: ['New Password is required'] } })
        if (old_password !== new_password) return res.status(422).json({ message: `Old Password & New Password Don't Match.` })
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
    },
    resetPassword: (req, res) => {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email Field is Required.' })
        authenticate(email, (err, result) => {
            if (err) return res.status(400).json({
                message: err
            })
            if (!result) return res.status(422).json({
                message: { email: ['User Not Found With The Given Email.'] }
            })
            if (result) {
                function randomString(length, chars) {
                    var mask = '';
                    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
                    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    if (chars.indexOf('#') > -1) mask += '0123456789';
                    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
                    var result = '';
                    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
                    return result;
                }
                let temp = randomString(12, 'a#A');
                result.password = null;
                let data = { ...result };
                data['password'] = hashSync(temp.toString(), 10);
                let fullname = data.first_name + ' ' + data.last_name
                delete data['id'];
                updateUser(result.id, data, (err, result) => {
                    if (err) return res.status(400).json({ message: err })
                    // return res.status(200).json({ message: "Password Reset Successfully, Please Check Your Mail." })
                })
                sendResetEmail(email, temp, fullname, (err, result) => {
                    if (err) return res.status(422).json({ message: err })
                    return res.status(200).json({ message: "If there is an email associated with an account, reset link will be sent." })
                })
            }
        })
    }
}