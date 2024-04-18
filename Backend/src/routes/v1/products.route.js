const express = require("express");
const validate = require("../../middlewares/validate")
const userValidation = require("../../modules/user/user.validation")
const productsController = require("../../modules/products/controllers")
const auth = require("../../middlewares/auth")

const router = express.Router();


router.route('/add-product').post(auth("adminAccess"), productsController.addProduct);
router.route('/update-product/:id').put(auth("adminAccess"), productsController.updateProduct);
router.route('/update-product-inventory/:id').put(auth("adminAccess"), productsController.updateInventory);

router.route('/get-all-products').get(productsController.getAllProducts)

router.route('/get-productbyId/:id').get(auth("adminAccess"), productsController.getProductById)
router.route('/getproductbyid/:id').get( productsController.getProductById)

router.route('/getproduct-By-name/:name').get(productsController.getproductByName)

router.route('/add-category').post(auth("adminAccess"), productsController.addCategory);
router.route('/getproduct-by-category/:category').get(productsController.youmaylike);
router.route('/getproduct-By-brand/:name').get(auth("adminAccess"), productsController.findProductbyBrand)
router.route('/getproductBrand-name/').get(productsController.getAllBrandNames)
router.route('/delete-product/:id').put(auth('adminAccess'), productsController.deleteProduct)
router.route('/add-product-incatogry-admin').post(productsController.addProductInBrandCatogryController)
router.route('/get-unique-brands').get(productsController.getUniqueBrands)

router.route('/getfeatured').get(productsController.getFeaturedProduct)

router.route('/admin-get-all-products').get(auth('adminAccess'), productsController.getAllProductsadmin)

router.route('/get-searchproducts').get(productsController.getSerchProducts)
//for admin
router.route('/get-all-Products-admin/').get(productsController.getAllProductsadminontroller)


router.route('/featureToggle/:id').post(auth('adminAccess'), productsController.featureToggle)
router.route('/visibleToggle/:id').post(auth('adminAccess'), productsController.visibleToggle)


module.exports = router;