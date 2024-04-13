const express = require("express");
const config = require('../../config/config');
const userRoute = require('./user.route');
const productsRoute = require('./products.route');
const cartRoute = require('./cart.route');
const authRoute = require('./auth.route');
const addressRoute = require('./address.route')
const orderRoute = require('./order.route')
const paymentRoute = require('./payment.route')
const { uploadFile, uploadThumbnail } = require("../../utils/fileUpload");
const router = express.Router();

const defaultRoutes = [
	{
		path: '/auth',
		route: authRoute,
	},
	{
		path: '/user',
		route: userRoute,
	},
	{
		path: '/products',
		route: productsRoute,
	},
	{
		path: '/cart',
		route: cartRoute,
	},

	{
		path: '/auth',
		route: authRoute
	},
	{
		path: '/address',
		route: addressRoute
	},
	{
		path: '/order',
		route: orderRoute
	},
	
	{
		path: '/payment',
		route:  paymentRoute
	},
]

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});
router.route('/upload-file').post(uploadFile);
router.route('/upload-thumbnail').post(uploadThumbnail);


module.exports = router;
