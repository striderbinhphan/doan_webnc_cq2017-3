const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "us-cdbr-east-04.cleardb.com",
    user: "b9ca7eb8a9609c",
    password: "50174bb1",
    database: "heroku_4778c351fa9c48b",
  },
  pool: { min: 0, max: 100 },
});
module.exports = knex;
