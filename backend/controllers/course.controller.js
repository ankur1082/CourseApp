const courseModel = require('../models/course.model')
const cloudinary = require('cloudinary')
const purchaseModel = require('../models/purchase.model')
const Stripe = require('stripe')
const config = require('../config')
const createCourse = async (req, res) => {
    const adminId = req.admin.id;
    const { title, description, price } = req.body;
    try {
        if (!title || !description || !price) {
            return res.status(400).json({
                errors: "All fields are required"
            })
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                errors: "no file uploaded"
            })
        }
        const { image } = req.files;
        const allowedFormat = ['image/png', 'image/jpeg']
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({
                errors: "Invalid file format. Only PNG and JPG are allowed"
            })
        }

        // cloudinary code
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({
                errors: "Error uploading file to cloudinary"
            })
        }

        const course = await courseModel.create({
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.url
            },
            creator: adminId
        });
        res.status(200).json({
            message: "Course created successfully",
            course
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error in creating course"
        })
    }
}

const updateCourse = async (req, res) => {
    let imageData = null;
    const adminId = req.admin.id;
    const { courseId } = req.params;
    const { title, description, price} = req.body;
    const image = req.files?.image || null;

    try {
        const isExistCourse = await courseModel.findById(courseId)
        if (!isExistCourse) {
            return res.status(400).json({
                errors: "Course not Found"
            })
        }
        if (image) {
            const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
            if (!cloud_response || cloud_response.error) {
                return res.status(400).json({
                    errors: "Error uploading file to cloudinary"
                })
            }
            imageData = {
                url: cloud_response.url,
                public_id: cloud_response.public_id
            }
        }



        const course = await courseModel.findOneAndUpdate({ _id: courseId, creator: adminId },
            {
                title,
                description,
                price,
                ...(imageData && {image: imageData})
            })
        if (!course) {
            return res.status(400).json({
                errors: "Can't update Course is created by other admin"
            });
        }

        res.status(200).json({
            message: "Course updated successfully",
            course
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error in updating course"
        })
    }
}

const deleteCourse = async (req, res) => {
    const adminId = req.admin.id;
    const { courseId } = req.params;
    try {
        const isExistCourse = await courseModel.findById(courseId)
        if (!isExistCourse) {
            return res.status(400).json({
                errors: "Course not Found"
            })
        }
        const course = await courseModel.findOneAndDelete({ _id: courseId, creator: adminId })
        if (!course) {
            return res.status(400).json({
                errors: "Course created by Other Admin"
            })
        }
        res.status(201).json({
            message: "Course deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error in deleting course"
        })
    }


}

const getCourses = async (req, res) => {
    try {
        const courses = await courseModel.find()
        res.status(200).json({
            message: "Courses fetched successfully",
            courses
        })
    } catch (error) {
        res.status(500).json({
            errors: "Errors in fetching courses"
        })
    }


}

const courseDetails = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await courseModel.findById(courseId)
        if (!course) {
            res.status(400).json({
                errors: "Course not found"
            })
        }
        res.status(200).json({
            message: "Course fetch successfully",
            course
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error in fetching this course"
        })
    }
}

const buyCourses = async (req, res) => {
    const userId = req.user.id;
    const { courseId } = req.params;

    try {
        const course = await courseModel.findById(courseId)
        if (!course) {
            return res.status(400).json({
                errors: "Course not found"
            })
        }
        const isAlreadyPurchased = await purchaseModel.findOne({ course: courseId, user: userId })
        if (isAlreadyPurchased) {
            return res.status(400).json({
                errors: "Course already purchased"
            })
        }
        // strip payment code goes here!!
        const amount = course.price
        const stripe = new Stripe(config.STRIP_SECRET_KEY)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ["card"]
        });

        res.status(200).json({
            message: "Course purchased successfully",
            course,
            client_Secret: paymentIntent.client_secret
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error in course buying"
        })
    }
}



module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
    getCourses,
    courseDetails,
    buyCourses
}