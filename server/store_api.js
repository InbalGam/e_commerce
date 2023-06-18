const express = require('express');
const storeRouter = express.Router();
const {pool} = require('./db');


storeRouter.use((req, res, next) => {
    if (!req.user) {
        return res.status(401).json({msg: 'You need to login first'});
    }
    next();
});


// Categories

// Get all categories-
storeRouter.get('/category', async (req, res, next) => { 
    try {
        const result = await pool.query('select * from category');
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500);
    }
});


// Post a new category-
storeRouter.post('/category', async (req, res, next) => { 
    const { categoryName } = req.body;

    if (categoryName === undefined) {
        return res.status(400).json({ msg: 'Please enter a category name' });
    };
    
    try {
        const check = await pool.query('select * from category where category_name = $1', [categoryName]);
        if (check.rows.length > 0) {
            return res.status(400).json({ msg: 'Please enter a different name this already exist' });
        }

        const timestamp = new Date(Date.now());
        await pool.query('insert into category (category_name, created_at) values ($1, $2);', [categoryName, timestamp]);
        res.status(200).json({msg: 'Added category'});
    } catch (e) {
        res.status(500);
    }
});



// Category
// Get a specific category-
storeRouter.get('/category/:category_id', async (req, res, next) => { 
    try {
        const result = await pool.query('select * from category where id = $1;', [req.params.category_id]);
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500);
    }
});


// Get a specific category, ALL products-
storeRouter.get('/category/:category_id/products', async (req, res, next) => { 
    try {
        const result = await pool.query('select p.* from category c join products p on c.id = p.category_id where p.category_id = $1;', [req.params.category_id]);
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500);
    }
});


// Update a specific category
storeRouter.put('/category/:category_id', async (req, res, next) => { 
    const { categoryName } = req.body;

    if (categoryName === undefined) {
        return res.status(400).json({ msg: 'Please enter a category name' });
    };
    
    const timestamp = new Date(Date.now());
    try {
        const check = await pool.query('select * from category where id = $1', [req.params.category_id]);
        if (check.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different category, this one is not in the system' });
        }
        await pool.query('update category set category_name = $2, modified_at = $3 where id = $1;', [req.params.category_id, categoryName, timestamp]);
        res.status(200).json({ msg: 'Updated category' });
    } catch(e) {
        res.status(500);
    }
});


// Delete a specific category
storeRouter.delete('/category/:category_id', async (req, res, next) => {
    try {
        const check = await pool.query('select * from category where id = $1', [req.params.category_id])
        if (check.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different category, this one is not in the system' });
        }
        await pool.query('delete from category where id = $1;', [req.params.category_id]);
        res.status(200).json({ msg: 'Deleted category' });
    } catch (e) {
        res.status(500);
    }
});


//Products

// Post a specific product-
storeRouter.post('/category/:category_id/', async (req, res, next) => { 
    const {   productName, inventoryQuantity, price, discountPercetage} = req.body;

    if (productName === undefined || inventoryQuantity === undefined || price === undefined) {
        return res.status(400).json({ msg: 'All fields must be specified' });
    };
    
    try {
        const check = await pool.query('select * from products where product_name = $1', [productName]);
        if (check.rows.length > 0) {
            return res.status(400).json({ msg: 'Please enter a different name this already exist' });
        }
        console.log('here');
        const timestamp = new Date(Date.now());
        await pool.query('insert into products (product_name, inventory_quantity, price, discount_percentage, category_id, created_at) values ($1, $2, $3, $4, $5, $6);', 
        [productName, inventoryQuantity, price, discountPercetage, req.params.category_id, timestamp]);
        res.status(200).json({msg: 'Added product'});
    } catch (e) {
        console.log(e);
        res.status(500);
    }
});


// Get a specific product-
storeRouter.get('/category/:category_id/:product_id', async (req, res, next) => { 
    try {
        const result = await pool.query('select * from products where id = $1 and category_id = $2;', [req.params.product_id, req.params.category_id]);
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500);
    }
});


// Update a specific product
storeRouter.put('/category/:category_id/:product_id', async (req, res, next) => { 
    const {   productName, inventoryQuantity, price, discountPercetage} = req.body;

    if (productName === undefined || inventoryQuantity === undefined || price === undefined) {
        return res.status(400).json({ msg: 'All fields must be specified' });
    };
    
    try {
        const check = await pool.query('select * from products where id = $1', [req.params.product_id]);
        if (check.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different product, this one is not in the system' });
        }

        const timestamp = new Date(Date.now());
        await pool.query('update products set product_name = $2, inventory_quantity = $3, price =$4, discount_percentage =$5, category_id = $6, modified_at = $7 where id = $1;', 
        [req.params.product_id, productName, inventoryQuantity, price, discountPercetage, req.params.category_id, timestamp]);
        res.status(200).json({msg: 'Updated product'});
    } catch (e) {
        res.status(500);
    }
});

// Delete a specific product
storeRouter.delete('/category/:category_id/:product_id', async (req, res, next) => {
    try {
        const check = await pool.query('select * from products where id = $1', [req.params.product_id])
        if (check.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different product, this one is not in the system' });
        }
        await pool.query('delete from products where id = $1;', [req.params.product_id]);
        res.status(200).json({ msg: 'Deleted product' });
    } catch (e) {
        res.status(500);
    }
});


module.exports = storeRouter;