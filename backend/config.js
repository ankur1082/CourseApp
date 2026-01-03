const dotenv = require('dotenv')
dotenv.config()

const JWT_SECRET_USER = process.env.JWT_SECRET_USER
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN
const STRIP_SECRET_KEY=process.env.STRIP_SECRET_KEY

module.exports = {
    JWT_SECRET_USER,
    JWT_SECRET_ADMIN,
    STRIP_SECRET_KEY
}