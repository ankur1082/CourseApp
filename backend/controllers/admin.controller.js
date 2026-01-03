const { z } = require('zod')
const config = require('../config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const adminModel = require('../models/admin.model')
const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            errors: "All fields are mandatory"
        })
    }

    const adminSchema = z.object({
        firstName: z.string().min(3, { message: "firstName must be at least 3 char long" }),
        lastName: z.string().min(3, { message: "lastName must be at least 3 char long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "password must be at least 6 char long" })
    })

    const validatedData = adminSchema.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json({
            errors: validatedData.error.issues.map(err => err.message)
        })
    }


    try {
        const isAlreadyExist = await adminModel.findOne({ email })
        if (isAlreadyExist) {
            return res.status(400).json({
                errors: "Admin already exist, Please login"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const admin = await adminModel.create({
            firstName,
            lastName,
            email,
            password: hashPassword
        })
        res.status(200).json({
            message: "Admin signup successfully",
            admin
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error in admin signup"
        })
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({
                errors: "Invalid credentials"
            })
        }

        const isValidPassword = await bcrypt.compare(password, admin.password)
        if (!isValidPassword) {
            return res.status(400).json({
                errors: "Invalid credentials"
            })
        }
        const token = jwt.sign({ id: admin._id }, 
            config.JWT_SECRET_ADMIN, {expiresIn: "1d"})
        
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true, // cannot be access by js directly
            secure: process.env.NODE_ENV === 'production',  //true for https only
            sameSite: "Strict"  // CSRF attack
        }
        res.cookie('jwt', token, cookieOptions);

        res.status(200).json({
            message: "Admin login successfully",
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                token
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
        if(!req.cookies.jwt) {
            return res.status(400).json({
                errors: "Kindly login first"
            })
        }
        res.clearCookie('jwt')
        res.status(200).json({
            message: "Admin logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            errors: "Error faced in logout"
        })
    }

}

module.exports = {
    login,
    signup,
    logout
}