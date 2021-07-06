const db = require("../utils/db");
module.exports = {
  deleteUser(user_id) {
    return db("user").where("user_id", user_id).del();
  },
  addLecture(lecture) {
    return db("user").insert(lecture);
  },
  allLearner() {
    return  db.select('user_id','user_name','user_email','user_dob').from('user').where('user_role','learner');
  },
  allLecture() {
    return  db.select('user_id','user_name','user_email','user_dob').from('user').where('user_role','lecture');
  },
};
