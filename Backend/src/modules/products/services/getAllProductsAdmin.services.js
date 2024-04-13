const mongoose = require('mongoose');
const ProductModel = require('../products.model');

const getAllProductsAdmin = async (name) => {
    try {
        console.log("name", name)
        if (name) {
            const products = await ProductModel.find({ name: { $regex: new RegExp(name, 'i') } });

            if (products.length > 0) {
                return { data: products, status: true, code: 200 };
            } else {
                return { data: "Product Not Found", status: false, code: 400 };
            }
        } else if (!name) {
            const product = await ProductModel.find();
            if (product?.length > 0) {
                return { data: product, status: true, code: 200 };
            } else {
                return { data: "Product Not Found", status: false, code: 400 };
            }
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getAllProductsAdmin;
