const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "us-cdbr-east-04.cleardb.com",
    user: "bbbcb8e9f69c81",
    password: "b58795b3",
    database: "heroku_13f86cfb8f84739",
  },
  pool: { min: 0, max: 100 },
});
module.exports = knex;
