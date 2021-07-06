const db = require("../utils/db");
module.exports = {
  deleteUser(user_id) {
    return db("user").where("user_id", user_id).del();
  },
  deleteCourse(course_id) {
    return db("course").where("course_id", course_id).del();
  },
  addCategory(category) {
    return db("category").insert(category);
  },
  addLecture(lecture) {
    return db("user").insert(lecture);
  },
  allCourses() {
    return  db.select('course_id','course_name','course_title','category_id','user_id','saleoff','last_update','course_status').from('course');
  },
  /* allCategory() {
    return  db('category').distinct('category_name');
  }, */
  
  allLearner() {
    return  db.select('user_id','user_name','user_email','user_dob').from('user').where('user_role','learner');
  },
  allLecture() {
    return  db.select('user_id','user_name','user_email','user_dob').from('user').where('user_role','lecture');
  },
};
