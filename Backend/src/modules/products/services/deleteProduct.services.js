const mongoose = require('mongoose');
const CategoryModal = require('../products.model');

const deleteProduct = async (id) => {
    try {
    console.log(id)
        let filterQuery = { active: true,_id:new mongoose.Types.ObjectId(id)};

        const removed = await CategoryModal.findOneAndUpdate(filterQuery,  { active: false } ,{new:true});
        console.log(removed)
        if (removed) {
            return { data: removed, message: "Product deleted Successfully", status: true, code: 200 };
        } else {
            return { data: "Category Not Found", status: false, code: 400 };
        }
    } catch (error) {
        console.log(error.message);
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = deleteProduct;
