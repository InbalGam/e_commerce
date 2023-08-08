const express = require('express');
const storeRouter = express.Router();
const {pool} = require('./db');
const multer = require('multer');
const path = require('path');


// Middlewares
storeRouter.use(['/order', '/order/:order_id'], (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({msg: 'You need to login first'});
    }
    next();
});

const checkAdmin = async (req, res, next) => {
    if (req.user.is_admin) {
        next();
    } else {
        res.status(401).json({ msg: 'Unauthorized' });
    }
};


storeRouter.use('/category/:category_id', async (req, res, next) => {
    try {
        const result = await pool.query('select * from category where id = $1;', [req.params.category_id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ msg: 'invalid category id' });
        }
        next();
    } catch (e) {
        res.status(500).json({ msg: 'Server error' });
    }
});


storeRouter.use('/category/:category_id/products/:product_id', async (req, res, next) => {
    try {
        const result = await pool.query('select * from products where id = $1 and category_id = $2;', [req.params.product_id, req.params.category_id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ msg: 'invalid product id' });
        }
        next();
    } catch (e) {
        res.status(500).json({ msg: 'Server error' });
    }
});


// Categories

// Get all categories-
storeRouter.get('/category', async (req, res, next) => { 
    try {
        const result = await pool.query('select c.*, if.filename as imageName from category c left join image_files if on c.image_id = if.id');
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Post a new category-
storeRouter.post('/category', async (req, res, next) => { 
    if (req.user.is_admin) {
        const { categoryName, imgId } = req.body;
        if (!categoryName) {
            return res.status(400).json({ msg: 'Please enter a category name' });
        };
        
        try {
            const check = await pool.query('select * from category where category_name = $1', [categoryName]);
            if (check.rows.length > 0) {
                return res.status(400).json({ msg: 'Please enter a different name this already exist' });
            }
    
            const timestamp = new Date(Date.now());
            await pool.query('insert into category (category_name, image_id, created_at) values ($1, $2, $3);', [categoryName, imgId, timestamp]);
            res.status(200).json({msg: 'Added category'});
        } catch (e) {
            console.log(e);
            res.status(500).json({msg: 'Server error'});
        }
    } else {
        return res.status(401).json({msg: 'Unauthorized'});
    }
});



// Category
// Get a specific category-
// storeRouter.get('/category/:category_id', async (req, res, next) => { 
//     try {
//         const result = await pool.query('select * from category where id = $1;', [req.params.category_id]);
//         res.status(200).json(result.rows);
//     } catch (e) {
//         res.status(500).json({msg: 'Server error'});
//     }
// });


// Get a specific category, ALL products-
storeRouter.get('/category/:category_id/products', async (req, res, next) => { 
    try {
        const result = await pool.query('select p.*, if.filename as imageName from category c join products p on c.id = p.category_id left join image_files if on p.image_id = if.id where p.category_id = $1;', [req.params.category_id]);
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Update a specific category
storeRouter.put('/category/:category_id', async (req, res, next) => {
    const { categoryName, imgId } = req.body;
    if (req.user.is_admin) {
        if (!categoryName) {
            return res.status(400).json({ msg: 'Please enter a category name' });
        };

        const timestamp = new Date(Date.now());
        try {
            await pool.query('update category set category_name = $2, image_id = $3, modified_at = $4 where id = $1;', [req.params.category_id, categoryName, imgId, timestamp]);
            res.status(200).json({ msg: 'Updated category' });
        } catch (e) {
            console.log(e);
            res.status(500).json({msg: 'Server error'});
        }
    } else {
        return res.status(401).json({msg: 'Unauthorized'});
    }
});


// Archive / Un-Archive a specific category
storeRouter.delete('/category/:category_id/archive', checkAdmin, async (req, res, next) => {
    const { status } = req.body;
    const timestamp = new Date(Date.now());
    try {
        await pool.query('update category set is_archived = $2, modified_at = $3 where id = $1;', [req.params.category_id, status, timestamp]);
        await pool.query('update products set is_archived = $2, modified_at = $3 where category_id = $1;', [req.params.category_id, status, timestamp]);
        res.status(200).json({ msg: `Archived category & products to ${status}` });
    } catch (e) {
        console.log(e);
        res.status(500).json({ msg: 'Server error' });
    }
});


// Image Upload & Retrieve
const imageUpload = multer({
    storage: multer.diskStorage(
        {
            destination: function (req, file, cb) {
                cb(null, 'images/');
            },
            filename: function (req, file, cb) {
                cb(
                    null,
                    new Date().valueOf() + 
                    '_' +
                    file.originalname
                );
            }
        }
    ), 
});
// Image Upload Routes
storeRouter.post('/image',
    async (req, res, next) => {
        if (req.user.is_admin) {
            next();
        } else {
            res.status(401).json({ msg: 'Unauthorized' });
        }
    },
    imageUpload.single('image'),
    async (req, res) => {
        //console.log(req.file);
        try {
            const result = await pool.query('insert into image_files (filename, filepath, mimetype, size) values ($1, $2, $3, $4) returning *;',
                [req.file.filename, req.file.path, req.file.mimetype, req.file.size]);
            res.status(200).json(result.rows[0]);
        } catch (e) {
            console.log(e);
            res.status(500).json({ msg: 'Server error' });
        }
});
// Image Get Routes
storeRouter.get('/image/:filename', (req, res) => {
    const { filename } = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'images/' + filename);
    return res.sendFile(fullfilepath);
});



//Products
// Post a specific product-
storeRouter.post('/category/:category_id', async (req, res, next) => {
    if (req.user.is_admin) {
        const { productName, inventoryQuantity, price, discountPercetage, imgId } = req.body;

        if (!productName || !inventoryQuantity || !price) {
            return res.status(400).json({ msg: 'All fields must be specified' });
        };

        try {
            const check = await pool.query('select * from products where product_name = $1', [productName]);
            if (check.rows.length > 0) {
                return res.status(400).json({ msg: 'Please enter a different name this already exist' });
            }
            const timestamp = new Date(Date.now());
            await pool.query('insert into products (product_name, inventory_quantity, price, discount_percentage, category_id, image_id, created_at) values ($1, $2, $3, $4, $5, $6, $7);',
                [productName, inventoryQuantity, price, discountPercetage, req.params.category_id, imgId, timestamp]);
            res.status(200).json({ msg: 'Added product' });
        } catch (e) {
            console.log(e);
            res.status(500).json({msg: 'Server error'});
        }
    } else {
        return res.status(401).json({msg: 'Unauthorized'});
    }
});


// Get a specific product-
storeRouter.get('/category/:category_id/products/:product_id', async (req, res, next) => { 
    try {
        const result = await pool.query('select p.*, if.filename as imageName from products p left join image_files if on p.image_id = if.id where p.id = $1 and category_id = $2;', [req.params.product_id, req.params.category_id]);
        res.status(200).json(result.rows);
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Server error'});
    }
});


// Update a specific product
storeRouter.put('/category/:category_id/products/:product_id', async (req, res, next) => {
    if (req.user.is_admin) {
        const { productName, inventoryQuantity, price, discountPercetage, imgId } = req.body;

        if (!productName || !inventoryQuantity || !price) {
            return res.status(400).json({ msg: 'All fields must be specified' });
        };

        try {
            const timestamp = new Date(Date.now());
            await pool.query('update products set product_name = $2, inventory_quantity = $3, price =$4, discount_percentage =$5, category_id = $6, image_id = $7, modified_at = $8 where id = $1;',
                [req.params.product_id, productName, inventoryQuantity, price, discountPercetage, req.params.category_id, imgId, timestamp]);
            res.status(200).json({ msg: 'Updated product' });
        } catch (e) {
            res.status(500).json({msg: 'Server error'});
        }
    } else {
        return res.status(401).json({msg: 'Unauthorized'});
    }
});

// Archive / Un-archive a specific product
storeRouter.delete('/category/:category_id/products/:product_id/archive', checkAdmin, async (req, res, next) => {
    const { status } = req.body;
    const timestamp = new Date(Date.now());
        try {
            await pool.query('update products set is_archived = $2, modified_at = $3 where id = $1;', [req.params.product_id, status, timestamp]);
            res.status(200).json({ msg: `Archived product to ${status}` });
        } catch (e) {
            console.log(e);
            res.status(500).json({msg: 'Server error'});
        }
});


// Cart

const combineCartProductsWithQuantity = (data, req) => {
    return data.rows.map(el => { return { ...el, quantity: req.session.cart.filter(pr => pr.productId === el.id)[0].quantity } });
};
// Get cart-
storeRouter.get('/cart', async (req, res, next) => {
    if (!req.session.cart) {
        res.status(200).json([]);
    } else {
        const productIds = req.session.cart.map(el => el.productId);
        try {
            const result = await pool.query('select p.id, p.product_name, p.inventory_quantity, p.price, p.discount_percentage, if.filename as imageName from products p left join image_files if on p.image_id = if.id where p.id = ANY ($1);', [productIds]);
            const productsInfo = combineCartProductsWithQuantity(result, req);
            res.status(200).json(productsInfo);
        } catch (e) {
            console.log(e);
            res.status(500).json({ msg: 'Server error' });
        }
    }
});


// Post to cart-
storeRouter.post('/cart', async (req, res, next) => {
    const { product_id, quantity } = req.body;

    try {
        const product = await pool.query('select * from products where id = $1', [product_id])
        if (product.rows.length === 0) {
            return res.status(400).json({ msg: 'Product does not exist' });
        }
        if (product.rows[0].inventory_quantity - quantity < 0) {
            return res.status(400).json({ msg: 'Not enough in stock' });
        }
        if (!req.session.cart) {
            req.session.cart = [{ productId: product_id, quantity: quantity }];
        } else {
            const productIds = req.session.cart.map(el => el.productId);
            if (productIds.includes(product_id)) {
                req.session.cart.filter(el => el.productId === product_id)[0].quantity = quantity;
            } else {
                req.session.cart = [...req.session.cart, { productId: product_id, quantity: quantity }];
            }
        };
        res.status(200).json({ msg: 'Added to cart' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ msg: 'Server error' });
    }
});


// Delete cart-
storeRouter.delete('/cart', async (req, res, next) => { 
    try {
        req.session.cart = [];
        res.status(200).json({msg: 'Deleted cart'});
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});



// Update in cart-
storeRouter.put('/cart/:product_id', async (req, res, next) => { 
    const { product_id, quantity } = req.body;
    
    try {
        const product = await pool.query('select * from products where id = $1', [product_id]);
        if (product.rows.length === 0) {
            return res.status(400).json({ msg: 'Product does not exist' });
        }
        if (product.rows[0].inventory_quantity - quantity < 0) {
            return res.status(400).json({msg: 'Not enough in stock'});
        }

        let productToUpdate = req.session.cart.filter(el => el.productId === product_id)[0];
        if (productToUpdate.productId){
            productToUpdate.quantity = quantity;
        } else {
            return res.status(400).json({ msg: 'Product does not exist in cart' });
        }

        res.status(200).json({msg: 'Updated product in cart'});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Server error'});
    }
});


// Delete in cart-
storeRouter.delete('/cart/:product_id', async (req, res, next) => { 
    try {
        req.session.cart = req.session.cart.filter(el => el.productId !== Number(req.params.product_id));
        res.status(200).json({msg: 'Deleted product from cart'});
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Order

// Get all user orders
storeRouter.get('/order', async (req, res, next) => { 
    try {
        const result = await pool.query('select * from order_details where user_id = $1 order by created_at desc;', [req.user.id]);
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});

// Post an order
storeRouter.post('/order', async (req, res, next) => { 
    const { address, phone } = req.body;

    if (address === undefined) {
        return res.status(400).json({ msg: 'Address must be specified' });
    };

    if (phone === undefined) {
        return res.status(400).json({ msg: 'Phone must be specified' });
    };
    
    try {
        const productIds = req.session.cart.map(el => el.productId);
        let productsData = await pool.query('select * from products where id = ANY ($1)', [productIds]);
        productsData = combineCartProductsWithQuantity(productsData, req);

        const productsInfo = productsData.map(el => {
            const finalPrice = el.discount_percentage ? el.price * el.quantity * (1 - (el.discount_percentage/100)) : el.price * el.quantity;
            const newQuantity = el.inventory_quantity - el.quantity;
            return {product_id: el.id, finalPrice: finalPrice, quantity: el.quantity, newQuantity: newQuantity}
        });

        const total = productsInfo.map(el => el.finalPrice).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        const timestamp = new Date(Date.now());
        const order_id = await pool.query('insert into order_details (user_id, total, shipping_address, phone, created_at) values ($1, $2, $3, $4, $5) returning id;', 
        [req.user.id, total, address, phone, timestamp]);


        productsInfo.forEach(async element => {
            await pool.query('insert into order_items (order_id, product_id, quantity, price, created_at) values ($1, $2, $3, $4, $5);', 
            [order_id.rows[0].id, element.product_id, element.quantity, element.finalPrice, timestamp]);
            await pool.query('update products set inventory_quantity = $2, modified_at = $3 where id = $1;', [element.product_id, element.newQuantity, timestamp]);
        });
        res.status(200).json({msg: 'Added order'});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Server error'});
    }
});


// Get a specific order
storeRouter.get('/order/:order_id', async (req, res, next) => { 
    try {
        const result = await pool.query('select oi.*, p.product_name from order_details od join order_items oi on od.id = oi.order_id join products p on p.id = oi.product_id where od.id = $1 and od.user_id = $2;', [req.params.order_id, req.user.id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ msg: 'Please choose a different order, this one is not in the system' });
        }
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});


// Search
storeRouter.post('/search', async (req, res, next) => { 
    const {searchWord} = req.body;
    try {
        const result = await pool.query('select p.*, if.filename as imageName from products p left join image_files if on p.image_id = if.id where LOWER(p.product_name) like $1;', [`%${searchWord.toLowerCase()}%`]);
        if (result.rows.length === 0) {
            return res.status(200).json({msg: 'no matching products'});
        }
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500).json({msg: 'Server error'});
    }
});

module.exports = storeRouter;