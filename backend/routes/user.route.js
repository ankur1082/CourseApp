const express = require('express')
const {signup, login, logout, getPurchased} = require('../controllers/user.controller')
const {userMiddleware} = require('../middlewares/user.middleware')


const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
router.get('/purchases', userMiddleware, getPurchased)

module.exports = router