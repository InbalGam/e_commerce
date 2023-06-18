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

    // it('POST /category should NOT create a new category- no category name', function () {
    //     const agent = request.agent(app);
    //     return agent
    //     .post('/login')
    //     .send({username: 'user_gCheck', password: 'user2828'}) // User exist
    //     .redirects(1)
    //     .then(() => {
    //         return agent
    //         .post('/category')
    //         .send({categoryName: undefined})
    //         .expect(400)
    //         .then((response) => {
    //             expect(response.body).to.be.deep.equal({msg: 'Please enter a category name'});
    //         });
    //     })
    // });

    // it('POST /category should NOT create a new category- category name exists', function () {
    //     const agent = request.agent(app);
    //     return agent
    //     .post('/login')
    //     .send({username: 'user_gCheck', password: 'user2828'}) // User exist
    //     .redirects(1)
    //     .then(() => {
    //         return agent
    //         .post('/category')
    //         .send({categoryName: 'pants'})
    //         .expect(400)
    //         .then((response) => {
    //             expect(response.body).to.be.deep.equal({msg: 'Please enter a different name this already exist'});
    //         });
    //     })
    // });

    // it('POST /category should create a new category- category name does not exists', function () {
    //     const agent = request.agent(app);
    //     return agent
    //     .post('/login')
    //     .send({username: 'user_gCheck', password: 'user2828'}) // User exist
    //     .redirects(1)
    //     .then(() => {
    //         return agent
    //         .post('/category')
    //         .send({categoryName: 'pantsCheck'})
    //         .expect(200)
    //         .then((response) => {
    //             expect(response.body).to.be.deep.equal({msg: 'Added category'});
    //         });
    //     })
    // });

});

