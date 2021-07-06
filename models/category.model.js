const db = require("../utils/db");
module.exports = {
  allCategory() {
    return db("category").distinct("category_name");
  },
  getCategoryById(category_id){
    return db('category').where('category_id',category_id);
  },
  addCategory(category) {
    return db("category").insert(category);
  }

};
