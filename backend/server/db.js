const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DB || 'e_commerce_project',
  password: 'postgres',
  port: 5432,
});


module.exports = {
  pool
};
