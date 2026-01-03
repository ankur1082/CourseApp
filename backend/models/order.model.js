const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    email: {
        type: String 
    },
    userId: {
        type: String
    },
    courseId: {
        type: String
    },
    paymentId: {
       type: String
    },
    amount: {
        type: Number
    },
    status: {
        type: String
    }
})

module.exports = mongoose.model('Order', orderSchema)