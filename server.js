const express = require('express');
const path = require('path');
const fs = require('fs');


const pathfile = path.join(__dirname, 'db.json');
const app = express();
const cache = {};

async function readfile() {
    try {
        let data = await fs.promises.readFile(pathfile, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err);
        return [];
    }
}
async function readfilewithdelay() {
    await new Promise((resolve) => {
        setTimeout(async () => {
            let data = await readfile();
            resolve(data);
        }, 1500);
    });
    return await readfile();
}

app.get('/products', async (req, res) => {
    try {
        let key=req.url;
        let value=cache[key];
        if (value){
            return res.json(value);
        }
        let products = await readfilewithdelay();
        cache[key] = products;
        return res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        let products = await readfile();

        const productId = parseInt(req.params.id);
        const product = products.find(p => p.id === productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Product not found" });
        }

    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});

//create object cache