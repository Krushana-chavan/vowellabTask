const express = require("express");
const validate = require("../../middlewares/validate")
const orderValidation = require("../../modules/orders/validation")
const OrderControllers = require("../../modules/orders/controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route('/add-order').post(auth('manageUsers'), validate(orderValidation.addOrder), OrderControllers.addOrder);
router.route('/get-myorder').get(auth('manageUsers'), OrderControllers.getMyOrders);
router.route('/admin-all-orders').get(auth('adminAccess'), OrderControllers.admingetAllOrders);
router.route('/getOrderbyId/:id').get(auth('manageUsers'), OrderControllers.getOrdersById);
router.route('/getOrderbyIdUser/:id').get(auth('manageUsers'), OrderControllers.getOrdersByIdUser);
router.route("/sucessRoute/:id").put(auth('manageUsers'), OrderControllers.successOrder)
module.exports = router;
