const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const config = require('../config')
const purchaseModel = require('../models/purchase.model')
const courseModel = require('../models/course.model')
const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            errors: "All fields are mandatory"
        })
    }

    const userSchema = z.object({
        firstName: z.string().min(3, { message: "firstName must be at least 3 char long" }),
        lastName: z.string().min(3, { message: "lastName must be at least 3 char long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "password must be at least 6 char long" })
    })

    const validatedData = userSchema.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json({
            errors: validatedData.error.issues.map(err => err.message)
        })
    }


    try {
        const isAlreadyExist = await userModel.findOne({ email })
        if (isAlreadyExist) {
            return res.status(400).json({
                errors: "User already exist, Please login"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashPassword
        })
        res.status(200).json({
            message: "User signup successfully",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                _id: user._id
            }
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error in user singup"
        })
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                errors: "Invalid credentials"
            })
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(400).json({
                errors: "Invalid credentials"
            })
        }
        const token = jwt.sign({ id: user._id },
            config.JWT_SECRET_USER, { expiresIn: "1d" })

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true, // cannot be access by js directly
            secure: process.env.NODE_ENV === 'production',  //true for https only
            sameSite: "none"  // CSRF attack
        }
        res.cookie('jwt', token, cookieOptions);

        res.status(200).json({
            message: "User login successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: token
            }
        })

    } catch (error) {
        res.status(500).json({
            errors: "Errors in login"
        })
    }
}

const logout = async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.status(400).json({
                errors: "Kindly login first"
            })
        }
        res.clearCookie('jwt')
        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error faced in logout",
            message: error.message
        })
    }

}

const getPurchased = async (req, res) => {
    const userId = req.user.id;
    try {
        const purchased = await purchaseModel.find({ user: userId });
        let purchasedCoursesId = []
        for (let i = 0; i < purchased.length; i++) {
            purchasedCoursesId.push(purchased[i].course)
        }
        const courseData = await courseModel.find({
            _id: { $in: purchasedCoursesId }
        })
        res.status(200).json({
            purchased,
            courseData
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error in fetching purchases"
        })
    }


}

module.exports = {
    signup,
    login,
    logout,
    getPurchased
}