const express = require("express");
const validate = require("../../middlewares/validate")
const authValidation = require("../../modules/auth/validation")
const authController = require("../../modules/auth/auth.controllers")
const auth = require("../../middlewares/auth")


const router = express.Router();

router.route('/admin-login').post(validate(authValidation.loginWithEmail), authController.adminLogin);

module.exports = router;
