
const ProductModel = require('../products.model');

const getUniqueBrands = async () => {
	try {
		// const result = await ProductModel.distinct("brand", { brand: { $ne: "" } });
		
		const result = await ProductModel.aggregate([
			{ $match: { brand: { $ne: "" }, visible:true } },
			{ $group: { _id: "$brand" } },
			{ $sort: { _id: 1 } },
			{ $project: { _id: 0, brand: "$_id" } },
		]).collation({ locale: 'en', strength: 2 });

		if (result.length) {
			return { data: result, status: true, code: 200 };
		} else {
			return { msg: "No brands found", status: false, code: 400 };
		}
	} catch (error) {
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = getUniqueBrands