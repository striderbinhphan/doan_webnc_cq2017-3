const db = require("../utils/db");
module.exports = {
  deleteUser(user_id) {
    return db("user").where("user_id", user_id).del();
  },
  deleteCourse(course_id) {
    return db("course").where("course_id", course_id).del();
  },
  addCategory(category){
      return db("category").insert(category);
  },
  addLecture(lecture){
      return db("user").insert(lecture);
  }
};
