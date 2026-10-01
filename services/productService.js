const database = require('../database/productDatabase');

async function getProducts() {
    return await database.readProducts();
}

async function getProductById(id) {
    const products = await database.readProducts();

    return products.find(product => product.id == id);
}

async function addProduct(product) {
    const products = await database.readProducts();

    products.push(product);

    await database.writeProducts(products);

    return product;
}

async function updateProduct(id, updatedProduct) {
    const products = await database.readProducts();

    const index = products.findIndex(product => product.id == id);

    if (index === -1) {
        return null;
    }

    products[index] = {
        ...products[index],
        ...updatedProduct
    };

    await database.writeProducts(products);

    return products[index];
}

async function deleteProduct(id) {
    const products = await database.readProducts();

    const index = products.findIndex(product => product.id == id);

    if (index === -1) {
        return null;
    }

    const deletedProduct = products[index];

    products.splice(index, 1);

    await database.writeProducts(products);

    return deletedProduct;
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};