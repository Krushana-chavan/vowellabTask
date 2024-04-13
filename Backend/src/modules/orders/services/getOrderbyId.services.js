const mongoose = require('mongoose');
const OrderModel = require('../order.model');

const getOrdersById = async (id) => {
    try {
        let filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) }
        const order = await OrderModel.findOne(filterQuery)

        if (!order) {
            return { data: "Order Not Found", status: false, code: 400 };
        }

        const orderWithUser = await OrderModel.aggregate([
            {
                $match: { _id: order._id }
            },
            {
                $lookup: {
                    from: 'transactions',
                    localField: 'transactionId', 
                    foreignField: '_id', 
                    as: 'transaction'
                }
            }
        ]);
       

        if (orderWithUser.length > 0) {
            return { data: orderWithUser[0], status: true, code: 200 };
        } else {
            return { data: "User Not Found", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getOrdersById;
