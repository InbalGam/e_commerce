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
        if (result.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different category, this one is not in the system' });
        }
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500);
    }
});


// Get a specific category, ALL products-
storeRouter.get('/category/:category_id/products', async (req, res, next) => { 
    try {
        const result = await pool.query('select p.* from category c join products p on c.id = p.category_id where p.category_id = $1;', [req.params.category_id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different category, this one is not in the system' });
        }
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
        const timestamp = new Date(Date.now());
        await pool.query('insert into products (product_name, inventory_quantity, price, discount_percentage, category_id, created_at) values ($1, $2, $3, $4, $5, $6);', 
        [productName, inventoryQuantity, price, discountPercetage, req.params.category_id, timestamp]);
        res.status(200).json({msg: 'Added product'});
    } catch (e) {
        res.status(500);
    }
});


// Get a specific product-
storeRouter.get('/category/:category_id/:product_id', async (req, res, next) => { 
    try {
        const result = await pool.query('select * from products where id = $1 and category_id = $2;', [req.params.product_id, req.params.category_id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different product, this one is not in the system' });
        }
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


// Cart

// Get cart-
storeRouter.get('/cart', async (req, res, next) => { 
    try {
        const result = await pool.query('select * from carts where user_id = $1;', [req.user.id]);
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500);
    }
});


// Post to cart-
storeRouter.post('/cart', async (req, res, next) => { 
    const { product_id, quantity } = req.body;
    let calculatedPrice;
    
    try {
        const check = await pool.query('select * from carts where user_id = $1 and product_id = $2', [req.user.id, product_id])
        if (check.rows.length > 0) {
            return res.status(400).json({ msg: 'Product already exist, please update it' });
        }

        const product = await pool.query('select * from products where id = $1', [product_id])
        if (product.rows.length === 0) {
            return res.status(400).json({ msg: 'Product does not exist' });
        }
        if (product.rows[0].inventory_quantity - quantity < 0) {
            return res.status(400).json({msg: 'Not enough in stock'});
        }
        if (product.rows[0].discount_percentage) {
            console.log('percentage');
           calculatedPrice = (product.rows[0].price * quantity * (product.rows[0].discount_percentage/100));
        } else {
            console.log('no percentage');
            calculatedPrice = product.rows[0].price;
        }

        const timestamp = new Date(Date.now());
        await pool.query('insert into carts (user_id, product_id, quantity, calculated_price, created_at) values ($1, $2, $3, $4, $5);', [req.user.id, product_id, quantity, calculatedPrice, timestamp]);

        const newQuantity = product.rows[0].inventory_quantity - quantity;
        await pool.query('update products set inventory_quantity = $2, modified_at = $3 where id = $1;', [product_id, newQuantity, timestamp]);
        res.status(200).json({msg: 'Added to cart and Updated product'});
    } catch (e) {
        res.status(500);
    }
});


// Delete cart-
storeRouter.delete('/cart', async (req, res, next) => { 
    try {
        await pool.query('delete from carts where user_id = $1;', [req.user.id]);
        res.status(200).json({msg: 'Deleted cart'});
    } catch (e) {
        res.status(500);
    }
});



// Update in cart-
storeRouter.put('/cart/:product_id', async (req, res, next) => { 
    const { product_id, quantity } = req.body;
    let calculatedPrice;
    
    try {
        const check = await pool.query('select * from carts where user_id = $1 and product_id = $2', [req.user.id, product_id])
        if (check.rows.length === 0) {
            return res.status(400).json({ msg: 'Product does not exist in cart, please add it' });
        }
        if (product.rows[0].inventory_quantity - quantity < 0) {
            return res.status(400).json({msg: 'Not enough in stock'});
        }
        if (product.rows[0].discount_percentage) {
            console.log('percentage');
           calculatedPrice = (product.rows[0].price * quantity * (product.rows[0].discount_percentage/100));
        } else {
            console.log('no percentage');
            calculatedPrice = product.rows[0].price;
        }

        const timestamp = new Date(Date.now());
        await pool.query('update carts set user_id = $1, product_id = $2, quantity = $3, calculated_price = $4, modified_at = $5 where user_id = $1 and product_id = $2;', [req.user.id, product_id, quantity, calculatedPrice, timestamp]);

        const newQuantity = (product.rows[0].inventory_quantity - quantity);
        await pool.query('update products set inventory_quantity = $2, modified_at = $3 where id = $1;', [product_id, newQuantity, timestamp]);
        res.status(200).json({msg: 'Updated product in cart and Updated product'});
    } catch (e) {
        res.status(500);
    }
});


// Delete in cart-
storeRouter.delete('/cart/:product_id', async (req, res, next) => { 
    try {
        const check = await pool.query('select * from carts where user_id = $1 and product_id = $2', [req.user.id, req.params.product_id])
        if (check.rows.length === 0) {
            return res.status(400).json({ msg: 'Product does not exist in cart, please add it' });
        }
        await pool.query('delete from carts where user_id = $1 and product_id = $2;', [req.user.id, req.params.product_id]);
        res.status(200).json({msg: 'Deleted product from cart'});
    } catch (e) {
        res.status(500);
    }
});


// Order

// Get an order
storeRouter.get('/order', async (req, res, next) => { 
    try {
        const result = await pool.query('select * from order_details od join order_items oi on od.id = oi.order_id where od.user_id = $1;', [req.user.id]);
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500);
    }
});

// Post an order
storeRouter.post('/order', async (req, res, next) => { 
    const { total, address, products } = req.body;
    
    try {
        const timestamp = new Date(Date.now());
        const order_id = await pool.query('insert into order_details (user_id, total, shipping_address, created_at) values ($1, $2, $3, $4) returning id;', 
        [req.user.id, total, address, timestamp]);
        
        console.log(products);
        products.forEach(async element => {
            await pool.query('insert into order_items (order_id, product_id, quantity, price, created_at) values ($1, $2, $3, $4, $5);', 
            [order_id.rows[0].id, element.product_id, element.quantity, element.price, timestamp]);
            console.log(element);
        });
        res.status(200).json({msg: 'Added order'});
    } catch (e) {
        console.log(e);
        res.status(500);
    }
});


// Get a specific order
storeRouter.get('/order/:order_id', async (req, res, next) => { 
    try {
        const result = await pool.query('select * from order_details od join order_items oi on od.id = oi.order_id where od.id = $1;', [req.params.order_id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different order, this one is not in the system' });
        }
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500);
    }
});

module.exports = storeRouter;