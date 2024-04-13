const express = require("express");
const validate = require("../../middlewares/validate")
const userValidation = require("../../modules/user/user.validation")
const CartControllers = require("../../modules/cart/controllers");
const auth = require("../../middlewares/auth");


const router = express.Router();

router.route('/add-to-cart').post(auth('manageUsers'),CartControllers.addToCartController);
router.route('/get-my-cart').get(auth('manageUsers'),CartControllers.getMyCartController);
router.route('/check-products-available').get(auth('manageUsers'),CartControllers.checkProductAvailable);
router.route('/remove-from-cart').post(auth('manageUsers'),CartControllers.removeFromCartController);
router.route('/remove-cart').post(auth('manageUsers'),CartControllers.removeCartController);

module.exports = router;
