const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course'
    }
})

module.exports = mongoose.model('Purchase', purchaseSchema)