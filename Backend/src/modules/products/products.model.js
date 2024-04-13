const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const productSchema = mongoose.Schema(
	{
		
		
		name: {
			type: String,
			trim: true,
			default: '',
			required: true,
		},
		features: {
			type: String,
			trim: true,
			default: '',
		},
		description: {
			type: String,
			trim: true,
			default: '',
		},
		
		productImageUrl: {
			type: String,
			trim: true,
			default: '',
			required: true,
		},
		
		visible: {
			type: Boolean,
			default: false,
		},
		price: {
			type: Number,
			default: 0,
			required: true,
		},
		discountMode: {
			type: String,
			default: "",
		},
		discountValue: {
			type: Number,
			default: 0,
		},
		inventory: {
			type: String,
			default: "0",
		},
		originalPrice: {
			type: Number,
			required: true,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		
		cost: {
			type: Number,
			default: 0,
		},
	
		
	
		active: {
			type: Boolean,
			default: true,
		},
		seqId: {
			type: Number
		},
		discountByRupees: {
			type: Number

		},
		discountPercentage: {
			type: Number

		}
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.pre('save', async function (next) {
	const product = this;

	product.seqId = await counterIncrementor('Product')
	/* capitalize first letter of brand */
	if (this.brand && typeof this.brand === 'string') {
		this.brand = this.brand.charAt(0).toUpperCase() + this.brand.slice(1);
	}
	next();
});

/**
 * @typedef Product
 */
productSchema.statics.getAllBrandNames = async function () {
	try {
		const brandNames = await this.distinct("brand");
		return brandNames;
	} catch (error) {
		console.error("Error while getting brand names:", error);
		throw error;
	}
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
