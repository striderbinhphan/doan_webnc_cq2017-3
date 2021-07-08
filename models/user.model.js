const db = require("../utils/db");
const config = require("../config/config.json");
const limit_of_page = config.LIMIT_OF_PAGE;

module.exports = {
  deleteUser(user_id) {
    return db("user").where("user_id", user_id).del();
  },
  addLecture(lecture) {
    return db("user").insert(lecture);
  },
  allLearner(page) {
    return  db.select('user_id','user_name','user_email','user_dob').from('user').where('user_role','learner')
    .limit(limit_of_page)
    .offset((page - 1) * limit_of_page);
  },
  allLecture(page) {
    return  db.select('user_id','user_name','user_email','user_dob').from('user').where('user_role','lecture')
    .limit(limit_of_page)
    .offset((page - 1) * limit_of_page);
  },
};
