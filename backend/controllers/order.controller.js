const orderModel = require('../models/order.model');
const purchaseModel = require('../models/purchase.model');
const orderData = async (req, res) => {
    const order = req.body;
    try {
        const orderInfo = await orderModel.create(order)
        const userId = orderInfo?.userId;
        const courseId = orderInfo?.courseId
        if (orderInfo) {
            await purchaseModel.create({
                user: userId,
                course: courseId
            })
        }
        res.status(200).json({
            message: "Order Details: ",
            orderInfo
        })

        

    } catch (error) {
        res.status(500).json({
            errors: "Error in order creation"
        })
    }
}


module.exports = {
    orderData
}