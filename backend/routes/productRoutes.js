const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);
router.post('/deposit', productController.depositFunds);
router.post('/buy', productController.buyProduct);
router.post('/reset', productController.resetDeposit);

module.exports = router;
