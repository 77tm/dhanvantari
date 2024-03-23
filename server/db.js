const Pool = require("pg").Pool;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "dhanvantari",
  password: "password",
  port: 5432,
});

module.exports = pool;
