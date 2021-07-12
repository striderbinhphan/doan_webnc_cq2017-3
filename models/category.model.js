const db = require("../utils/db");
const limit_of_page = process.env.LIMIT_OF_PAGE;
module.exports = {
  allCategory(page) {
    return db("category")
      .distinct("category_name")
      .limit(limit_of_page)
      .offset((page - 1) * limit_of_page);
  },
  getCategoryById(category_id) {
    return db("category").where("category_id", category_id);
  },
  addCategory(category) {
    return db("category").insert(category);
  },
};
