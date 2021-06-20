const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./api/users/userRoute')
const authRoutes = require('./api/auth/authRoute')
const productRoute = require('./api/product_info/productRoute')
const cors = require('cors')

//Environment variable
const port = process.env.PORT

//parser
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

//CORS
app.use(cors())

//defualt url callback
app.get("/", (req, res) => {
    res.status(200).send({
        message: "Node.js application server"
    })
})

//middleware
app.use('/api', userRoutes, authRoutes, productRoute)


app.listen(port || 3000, () => {
    console.log(`Server is running on port ${port}`);
})