const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const store = new session.MemoryStore();
const {pool} = require('./server/db');
const {comparePasswords} = require('./hash');

module.exports = app;

const PORT = process.env.PORT || 4001;

app.use(morgan('short'));
// middleware for handling CORS requests from index.html
app.use(cors());


// middleware for parsing request bodies here:
app.use(bodyParser.json());


// middlewares for authentication
app.use(
  session({
    secret: "f4z4gs$Gcg",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
  })
);


app.use(passport.initialize());
app.use(passport.session());


passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const results = await pool.query('select * from users where username = $1', [username]);
      if (results.rows.length === 0) {
        return done(null, false);
      }
      const passwordCheck = await comparePasswords(password, results.rows[0].password);
      if (!passwordCheck) {
        return done(null, false);
      }
      return done(null, results.rows[0]);
    }
    catch (e) {
      done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const results = await pool.query('select * from users where id = $1', [id]);
    done(null, results.rows[0]);
  } catch(e) {
    done(err);
  }
});


// Start auth router
const authRouter = require('./server/auth_api');
app.use('/', authRouter);

// Start app routers
const storeRouter = require('./server/store_api');
app.use('/', storeRouter);


// This conditional is here for testing purposes:
if (!module.parent) { 
  // start the server listening at PORT below:
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
