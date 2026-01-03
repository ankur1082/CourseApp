const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const courseRoute = require('./routes/course.route')
const userRoute = require('./routes/user.route')
const adminRoute = require('./routes/admin.route')
const orderRoute = require('./routes/order.route')
const cloudinary = require('cloudinary')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const app = express()
dotenv.config();

// middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cookieParser())

cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET 
    });

const port = process.env.PORT || 4000
const DB_URI = process.env.MONGO_URI;

mongoose.connect(DB_URI)
.then(() => {
    console.log('DataBase Connected')
})
.catch((error) => {
    console.log(error)
})
app.use('/api/v1/course', courseRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/order', orderRoute)

app.get('/', (req, res) => {
    res.send('Working done!!!')
})

app.listen(port, () => {
    console.log(`Server is running on localhost: ${port}`)
})