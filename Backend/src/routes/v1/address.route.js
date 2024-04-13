const express = require("express");
const validate = require("../../middlewares/validate")
const addressValidation = require("../../modules/addresses/validation")
const addressController = require("../../modules/addresses/controllers");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.route('/add-address').post(validate(addressValidation.addAddress), auth("manageUsers"),addressController.addAddressController);
router.route('/remove-address/:addressId').post(auth("manageUsers"),addressController.removeAddressController)
router.route('/getAddress/:id').get(auth("manageUsers"),addressController.getAddressByIdController)
router.route('/getAddress-ByAdmin/:id').get(auth("adminAccess"),addressController.getAddressByIdController)
router.route('/get-my-address').get(auth("manageUsers"),addressController.getMyAllAddress)
router.route('/update-address/:id').post(auth("manageUsers"),addressController.updateAddress)

module.exports = router;