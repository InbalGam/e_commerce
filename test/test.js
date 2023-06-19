const expect = require('chai').expect;
const request = require('supertest');
const {pool} = require('../server/db');

const app = require('../server');
const PORT = process.env.PORT || 4001;


// Authorization tests
describe('Login Authorization tests', function() {
    it('should pass auth check for log in', function() {
        const agent = request.agent(app);
        return agent
            .post('/login')
            .send({username: 'user_gCheck', password: 'user2828'}) // User exist
            .redirects(1)
            .expect(200);
    });

    it('should NOT pass auth check for log in', function() {
        const agent = request.agent(app);
        return agent
            .post('/login')
            .send({username: 'user_gCheck', password: 'bldadala23pppppp99'}) // User doesn't exist
            .redirects(1)
            .expect(401);
    });
});


describe('Register Authorization tests', function() {
    it('should NOT pass- all fields needs specification', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'userCHECK', password: 'passwordCHECK'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'All fields should be specified'});
            });
    });

    it('should NOT pass- password length limitation', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'userCHECK', password: 'p23f', nickname: 'userNickname', firstName: 'user1', lastName: 'logi', address: 'bliblu', phone: '34353'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Password needs to be at least 8 characters'});
            });
    });

    it('should NOT pass- username length limitation', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'us', password: 'passwordCHECK', nickname: 'userNickname',  firstName: 'user1', lastName: 'logi', address: 'bliblu', phone: '34353'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Username needs to be at least 3 characters'});
            });
    });

    it('should NOT pass- nickname length limitation', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'userCHECK', password: 'passwordCHECK', nickname: 'us',  firstName: 'user1', lastName: 'logi', address: 'bliblu', phone: '34353'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Nickname needs to be at least 3 characters'});
            });
    });

    it('should NOT pass- username OR nickname already exist', function() {
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'user_gCheck', password: 'passwordCHECK', nickname: 'userNickname',  firstName: 'user1', lastName: 'logi', address: 'bliblu', phone: '34353'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Username or Nickname already exist, choose differently'});
            });
    });

    it('should pass- insert new user', function() {   
        const agent = request.agent(app);
        return agent
            .post('/register')
            .send({username: 'userCHECK1235', password: 'passwordCHECK', nickname: 'userNickname123424',  firstName: 'user1', lastName: 'logi', address: 'bliblu', phone: '34353'})
            .expect(201)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Success creating user'});
            });
    });
});


describe('Logout Authorization tests', function() {
    it('should pass auth check for log out', function() {
        const agent = request.agent(app);
        return agent
            .get('/logout')
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Successfully logged out'});
            });
    });
});


describe('Update profile page', function() {
    it('should NOT pass- all fields needs specification', function() {
        const agent = request.agent(app);
        return agent
            .put('/profile')
            .send({username: 'userCHECK', password: 'passwordCHECK'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'All fields should be specified'});
            });
    });

    it('should pass- all fields specified', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/profile')
            .send({address: 'CHECK', phone: 'checky'})
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Updated user'});
            })
        });
    });
});


// Store routes

// Categories
describe('/category routes', function() {
    it('GET /category returns all categories', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category')
            .then((response) => {
                expect(response.body).to.be.an.instanceOf(Array);
            })
        });
    });

    it('GET /category returns an array of categories', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category')
            .expect(200)
            .then(async (response) => {
                const results = await pool.query('select * from category');
                expect(response.body.length).to.be.equal(results.rows.length);
                response.body.forEach((comment) => {
                    expect(comment).to.have.ownProperty('id');
                    expect(comment).to.have.ownProperty('category_name');
                    expect(comment).to.have.ownProperty('created_at');
                    expect(comment).to.have.ownProperty('modified_at');
                });
            });
        })
    });

    it('POST /category should NOT create a new category- no category name', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/category')
            .send({categoryName: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please enter a category name'});
            });
        })
    });

    it('POST /category should NOT create a new category- category name exists', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/category')
            .send({categoryName: 'pants'})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please enter a different name this already exist'});
            });
        })
    });

    it('POST /category should create a new category- category name does not exists', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/category')
            .send({categoryName: 'pantsCheck'})
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Added category'});
            });
        })
    });

});


// Category
describe('/category routes- with products also', function() {
    it('GET /category/:category_id returns a specific category', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category/4')
            .then((response) => {
                expect(response.body).to.be.an.instanceOf(Object);
            })
        });
    });

    it('GET /category/:category_id returns a specific category', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category/4')
            .expect(200)
            .then((response) => {
                expect(response.body[0]).to.have.ownProperty('id');
                expect(response.body[0]).to.have.ownProperty('category_name');
                expect(response.body[0]).to.have.ownProperty('created_at');
                expect(response.body[0]).to.have.ownProperty('modified_at');
            });
        })
    });

    it('GET /category/:category_id should NOT return a specific category- wrong id', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category/14')
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please choose a different category, this one is not in the system'});
            })
        });
    });

    it('GET /category/:category_id/products returns a specific category all products', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category/1/products')
            .then((response) => {
                expect(response.body).to.be.an.instanceOf(Array);
            })
        });
    });

    it('GET /category/:category_id/products returns a specific category all products', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category/1/products')
            .expect(200)
            .then(async (response) => {
                const results = await pool.query('select p.* from category c join products p on c.id = p.category_id where p.category_id = 1');
                expect(response.body.length).to.be.equal(results.rows.length);
                response.body.forEach((product) => {
                    expect(product).to.have.ownProperty('id');
                    expect(product).to.have.ownProperty('product_name');
                    expect(product).to.have.ownProperty('inventory_quantity');
                    expect(product).to.have.ownProperty('price');
                    expect(product).to.have.ownProperty('discount_percentage');
                    expect(product).to.have.ownProperty('category_id');
                    expect(product).to.have.ownProperty('created_at');
                    expect(product).to.have.ownProperty('modified_at');
                });
            });
        });
    });

    it('GET /category/:category_id/products should NOT return a specific category- wrong id', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category/14/products')
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please choose a different category, this one is not in the system'});
            })
        });
    });

    it('PUT /category/:category_id should NOT update a specific category- no category name', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/category/4')
            .send({categoryName: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please enter a category name'});
            });
        });
    });

    it('PUT /category/:category_id should NOT update a specific category- wrong id', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/category/24')
            .send({categoryName: 'check'})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please choose a different category, this one is not in the system'});
            });
        });
    });

    it('PUT /category/:category_id should update a specific category', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/category/4')
            .send({categoryName: 'check'})
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Updated category'});
            });
        });
    });

    it('DELETE /category/:category_id should NOT delete a specific category- wrong id', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/category/24')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please choose a different category, this one is not in the system'});
            });
        });
    });

    it('DELETE /category/:category_id should delete a specific category', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/category/4')
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Deleted category'});
            });
        });
    });
});


// Products
describe('/category/:category_id/:product_id routes', function() {
    it('GET /category/:category_id/:product_id returns a specific category', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category/1/1')
            .then((response) => {
                expect(response.body).to.be.an.instanceOf(Object);
            })
        });
    });

    it('GET /category/:category_id/:product_id returns a specific category', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category/1/1')
            .expect(200)
            .then((response) => {
                expect(response.body[0]).to.have.ownProperty('id');
                expect(response.body[0]).to.have.ownProperty('product_name');
                expect(response.body[0]).to.have.ownProperty('inventory_quantity');
                expect(response.body[0]).to.have.ownProperty('price');
                expect(response.body[0]).to.have.ownProperty('discount_percentage');
                expect(response.body[0]).to.have.ownProperty('category_id');
                expect(response.body[0]).to.have.ownProperty('created_at');
                expect(response.body[0]).to.have.ownProperty('modified_at');
            });
        })
    });

    it('GET /category/:category_id/:product_id should NOT return a specific category- wrong id', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/category/1/14')
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please choose a different product, this one is not in the system'});
            })
        });
    });

    it('POST /category/:category_id/ should NOT create a new product- fields need specification', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/category/1/')
            .send({productName: undefined, inventoryQuantity: 10, price: 3, discountPercetage: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'All fields must be specified'});
            });
        })
    });


    it('POST /category/:category_id/ should NOT create a new product- product name exists', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/category/1/')
            .send({productName: 'large pants black', inventoryQuantity: 10, price: 3, discountPercetage: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please enter a different name this already exist'});
            });
        })
    });

    it('POST /category/:category_id/ should create a new product', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/category/1/')
            .send({productName: 'check', inventoryQuantity: 10, price: 3, discountPercetage: undefined})
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Added product'});
            });
        })
    });

    it('PUT /category/:category_id/ should NOT update a product- fields need specification', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/category/5/1')
            .send({productName: undefined, inventoryQuantity: 10, price: 3, discountPercetage: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'All fields must be specified'});
            });
        })
    });


    it('PUT /category/:category_id/ should NOT update a product- wrong id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/category/1/10')
            .send({productName: 'pants', inventoryQuantity: 10, price: 3, discountPercetage: undefined})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please choose a different product, this one is not in the system'});
            });
        })
    });

    it('PUT /category/:category_id/ should update a product', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/category/3/4')
            .send({productName: 'check8888', inventoryQuantity: 10, price: 3, discountPercetage: 5})
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Updated product'});
            });
        })
    });

    it('DELETE /category/:category_id/:product_id should NOT delete a specific product- wrong id', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/category/1/10')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please choose a different product, this one is not in the system'});
            });
        });
    });

    it('DELETE /category/:category_id/:product_id should delete a specific product', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/category/3/5')
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Deleted product'});
            });
        });
    });

});


// Cart
describe('/cart routes', function() {
    it('POST /cart should NOT post product in cart- wrong product id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/cart')
            .send({product_id: 20, quantity: 2})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Product does not exist'});
            });
        })
    });


    it('POST /cart should NOT post product in cart- not enough inventory', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/cart')
            .send({product_id: 2, quantity: 200})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Not enough in stock'});
            });
        })
    });

    it('POST /cart should post product in cart', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/cart')
            .send({product_id: 2, quantity: 2})
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Added to cart and Updated product'});
            });
        })
    });

    it('POST /cart should post product in cart', function () { // in order to have multiple products in cart for further tests
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/cart')
            .send({product_id: 4, quantity: 2})
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Added to cart and Updated product'});
            });
        })
    });

    it('POST /cart should NOT post product in cart- product already in cart', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/cart')
            .send({product_id: 2, quantity: 2})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Product already exist, please update it'});
            });
        })
    });

    it('GET /cart returns a specific cart', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/cart')
            .then((response) => {
                expect(response.body).to.be.an.instanceOf(Array);
            })
        });
    });

    it('GET /cart returns a specific cart', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/cart')
            .expect(200)
            .then((response) => {
                expect(response.body[0]).to.have.ownProperty('id');
                expect(response.body[0]).to.have.ownProperty('user_id');
                expect(response.body[0]).to.have.ownProperty('product_id');
                expect(response.body[0]).to.have.ownProperty('quantity');
                expect(response.body[0]).to.have.ownProperty('calculated_price');
                expect(response.body[0]).to.have.ownProperty('created_at');
                expect(response.body[0]).to.have.ownProperty('modified_at');
            });
        })
    });

    it('PUT /cart/:product_id should NOT update a product in cart- wrong product id', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/cart/5')
            .send({product_id: 5, quantity: 5})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Product does not exist in cart, please add it'});
            });
        })
    });

    it('PUT /cart/:product_id should NOT update a product in cart- not enough inventory', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/cart/2')
            .send({product_id: 2, quantity: 55})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Not enough in stock'});
            });
        })
    });


    it('PUT /cart/:product_id should update a product in cart', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .put('/cart/2')
            .send({product_id: 2, quantity: 5})
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Updated product in cart and Updated product'});
            });
        })
    });

    it('DELETE /cart/:product_id should NOT delete a specific product- wrong product id', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/cart/14')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Product does not exist in cart, please add it'});
            });
        });
    });

    it('DELETE /cart/:product_id should delete a specific product', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/cart/2')
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Deleted product from cart'});
            });
        });
    });

    it('DELETE /cart/ should delete cart', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .delete('/cart')
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Deleted cart'});
            });
        });
    });

});


// Order
describe('/cart routes', function() {
    it('GET /order returns all orders', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/order')
            .then((response) => {
                expect(response.body).to.be.an.instanceOf(Array);
            })
        });
    });

    it('POST /order should NOT post an order- no address', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/order')
            .send({total: 50, address: undefined, products:[{product_id: 2, quantity: 2, price: 2}, {product_id: 4, quantity: 2, price: 2}]})
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Address must be specified'});
            });
        })
    });

    it('POST /order should post an order', function () {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .post('/order')
            .send({total: 50, address: 'check', products:[{product_id: 2, quantity: 2, price: 2}, {product_id: 4, quantity: 2, price: 2}]})
            .expect(200)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Added order'});
            });
        })
    });

    it('GET /order/:order_id should NOT return a specific order- wrong id', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/order/22')
            .expect(400)
            .then((response) => {
                expect(response.body).to.be.deep.equal({msg: 'Please choose a different order, this one is not in the system'});
            });
        });
    });

    it('GET /order/:order_id returns a specific order', function() {
        const agent = request.agent(app);
        return agent
        .post('/login')
        .send({username: 'user_gCheck', password: 'user2828'}) // User exist
        .redirects(1)
        .then(() => {
            return agent
            .get('/order/2')
            .then((response) => {
                expect(response.body).to.be.an.instanceOf(Object);
            })
        });
    });

});
