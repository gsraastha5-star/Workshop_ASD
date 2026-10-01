const fs = require('fs');
const path = require('path');

const pathfile = path.join(__dirname, '..', 'db.json');

async function readProducts() {
    try {
        const data = await fs.promises.readFile(pathfile, 'utf-8');

        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err);
        return [];
    }
}

async function writeProducts(products) {
    try {
        await fs.promises.writeFile(
            pathfile,
            JSON.stringify(products, null, 2)
        );

        return products;
    } catch (err) {
        console.error("Error writing file:", err);
        throw err;
    }
}

module.exports = {
    readProducts,
    writeProducts
};