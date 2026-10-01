const express = require('express');

const router = express.Router();

const productController = require('../controllers/productController');

const {
    cacheMiddleware
} = require('../middleware/cacheMiddleware');


router.get(
    '/products',
    cacheMiddleware,
    productController.getProducts
);


router.get(
    '/products/:id',
    cacheMiddleware,
    productController.getProductById
);


router.post(
    '/products',
    productController.addProduct
);


router.put(
    '/products/:id',
    productController.updateProduct
);


router.patch(
    '/products/:id',
    productController.updateProduct
);


router.delete(
    '/products/:id',
    productController.deleteProduct
);


module.exports = router;