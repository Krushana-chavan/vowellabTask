const express = require("express");
const auth = require("../../middlewares/auth");
const Controller = require('../../modules/payments/controller')

const validate = require("../../middlewares/validate")

const router = express.Router();

router.route('/payment-seesion').post(Controller.stripPayment);


module.exports = router;

