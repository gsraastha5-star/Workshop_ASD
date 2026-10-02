const productService = require('../services/productService');

const {
    clearCache
} = require('../middleware/cacheMiddleware');


async function getProducts(req, res) {
    try {
        const products = await productService.getProducts();

        res.json(products);

    } catch (error) {
        console.error("Error fetching products:", error);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


async function getProductById(req, res) {
    try {
        const id = req.params.id;

        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        console.error("Error fetching product:", error);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


async function addProduct(req, res) {
    try {
        const product = req.body;

        const newProduct = await productService.addProduct(product);

        clearCache();

        res.status(201).json(newProduct);

    } catch (error) {
        console.error("Error adding product:", error);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


async function updateProduct(req, res) {
    try {
        const id = req.params.id;

        const updatedProduct = await productService.updateProduct(
            id,
            req.body
        );

        if (!updatedProduct) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        clearCache();

        res.json(updatedProduct);

    } catch (error) {
        console.error("Error updating product:", error);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


async function deleteProduct(req, res) {
    try {
        const id = req.params.id;

        const deletedProduct = await productService.deleteProduct(id);

        if (!deletedProduct) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        clearCache();

        res.json(deletedProduct);

    } catch (error) {
        console.error("Error deleting product:", error);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};