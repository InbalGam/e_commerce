const express = require('express');
const authRouter = express.Router();
const {pool} = require('./db');
const passport = require("passport");
const {passwordHash} = require('../hash');


// Registering a user
authRouter.post("/register", async (req, res, next) => {
    const { username, password, nickname, firstName, lastName, address, phone, is_admin } = req.body;
    if (!username || !password || !nickname || !firstName || !lastName || !address || !phone || !is_admin) {
        return res.status(400).json({ msg: 'All fields should be specified' });
    };

    if (password.length < 8) {
        return res.status(400).json({ msg: 'Password needs to be at least 8 characters' });
    }

    if (username.length < 3) {
        return res.status(400).json({ msg: 'Username needs to be at least 3 characters' });
    }

    if (nickname.length < 3) {
        return res.status(400).json({ msg: 'Nickname needs to be at least 3 characters' });
    }

    try {
        const check = await pool.query('select * from users where username = $1 or nickname = $2;', [username, nickname]);
        if (check.rows.length > 0) {
            return res.status(400).json({ msg: 'Username or Nickname already exist, choose differently' });
        }
        const hashedPassword = await passwordHash(password, 10);
        const timestamp = new Date(Date.now());
        await pool.query('insert into users (username, password, nickname, first_name, last_name, address, phone, is_admin, created_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9);', 
        [username, hashedPassword, nickname, firstName, lastName, address, phone, is_admin, timestamp]);
        res.status(201).json({
            msg: "Success creating user"
        })
    } catch (e) {
        res.status(500).json({ msg: 'Could not create user' });
    }
});


// Login a user - local strategy
authRouter.get("/login", (req, res) => {
    res.status(401).json({msg: 'Authentication failed'});
});


// Get user profile page
authRouter.get("/profile", async (req, res) => {
    try {
        const result = await pool.query('select * from users where id = $1', [req.user.id]);
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500);
    }
});


authRouter.post("/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/profile");
    }
);


// Login a user - using Google
authRouter.get('/login/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));


authRouter.get('/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: `${process.env.CORS_ORIGIN}/login`, failureMessage: true }),
  (req, res) => {
    res.redirect(`${process.env.CORS_ORIGIN}/profile`);
});


// Logout user
authRouter.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      //res.redirect('/');
      res.status(200).json({msg: 'Successfully logged out'})
    });
});



// Update user profile page
authRouter.put('/profile', async (req, res, next) => { 
    const { address, phone } = req.body;

    if (!address || !phone) {
        return res.status(400).json({ msg: 'All fields should be specified' });
    };

    try {
        const timestamp = new Date(Date.now());
        await pool.query('update users set address = $2, phone = $3, modified_at = $4 where id = $1;', [req.user.id, address, phone, timestamp]);
        res.status(200).json({ msg: 'Updated user' });
    } catch(e) {
        res.status(500);
    }
});

module.exports = authRouter;