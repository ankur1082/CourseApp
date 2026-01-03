const express = require('express')
const {createCourse, updateCourse, deleteCourse, getCourses, courseDetails, buyCourses} = require('../controllers/course.controller')
const {userMiddleware} = require('../middlewares/user.middleware')
const {adminMiddleware} = require('../middlewares/admin.middleware')

const router = express.Router()

router.post('/create', adminMiddleware, createCourse)
router.put('/update/:courseId', adminMiddleware, updateCourse);
router.delete('/delete/:courseId', adminMiddleware, deleteCourse);
router.get('/courses', getCourses)
router.get('/:courseId', courseDetails)

router.post('/buy/:courseId',userMiddleware, buyCourses)




module.exports = router