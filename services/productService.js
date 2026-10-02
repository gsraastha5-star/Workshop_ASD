const database = require('../database/productDatabase');

async function getProducts() {
    return await database.readProducts();
}

async function getProductById(id) {
    const products = await database.readProducts();

    return products.find(product => String(product.id) === String(id));
}

async function addProduct(product) {
    const products = await database.readProducts();

    const newId = product.id
        ? Number(product.id)
        : (products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1);

    const newProduct = {
        id: newId,
        ...product
    };

    products.push(newProduct);

    await database.writeProducts(products);

    return newProduct;
}

async function updateProduct(id, updatedProduct) {
    const products = await database.readProducts();

    const index = products.findIndex(product => String(product.id) === String(id));

    if (index === -1) {
        return null;
    }

    products[index] = {
        ...products[index],
        ...updatedProduct,
        id: products[index].id
    };

    await database.writeProducts(products);

    return products[index];
}

async function deleteProduct(id) {
    const products = await database.readProducts();

    const index = products.findIndex(product => String(product.id) === String(id));

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