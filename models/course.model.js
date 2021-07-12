const db = require("../utils/db");
const config = require("../config/config.json");
const limit_of_page = config.LIMIT_OF_PAGE;

module.exports = {
  allCoursesForGuest(page) {
    return db("course")
      .limit(limit_of_page)
      .offset((page - 1) * limit_of_page);
  },
  allCoursesForAdmin() {
    return db
      .select(
        "course_id",
        "course_name",
        "course_title",
        "category_id",
        "user_id",
        "saleoff",
        "last_update",
        "course_status"
      )
      .from("course");
  },
  webCourses(page) {
    return db("course")
      .where("category_id", 1)
      .limit(limit_of_page)
      .offset((page - 1) * limit_of_page);
  },
  mobileCourses(page) {
    return db("course")
      .where("category_id", 2)
      .limit(limit_of_page)
      .offset((page - 1) * limit_of_page);
  },
  getCourseById(id) {
    const kq = db("course").where("course_id", id);
    return kq;
  },
  getCourseByCategory(category_id, page) {
    console.log("vao get course by id");
    return db("course")
      .where("category_id", category_id)
      .limit(limit_of_page)
      .offset((page - 1) * limit_of_page);
  },
  coursesSearch(keyword, page) {
    return db("course")
      .where("course_name", "like", `%${keyword}%`)
      .orderBy("last_update", "asc")
      .limit(limit_of_page)
      .offset((page - 1) * limit_of_page);
  },
  deleteCourse(course_id) {
    return db("course").where("course_id", course_id).del();
  },
  getFeedBack(course_id) {
    return db
      .select("review_id", "review_feedback", "user_id", "timestamp")
      .from("review")
      .where("course_id", course_id);
  },
  getCourseOfLecture(lecture_id) {
    return db.select("course_name").from("course").where("user_id", lecture_id);
  },
  coursesSearchWithOutPaging(keyword) {
    return db("course").where("course_name", "like", `%${keyword}%`);
  },
  getAvgPointByCourseID(course_id) {
    return db("review")
      .avg("review_rating as course_rv_point")
      .where("course_id", course_id);
  },
  async searchAndSort(keyword) {
    result = await this.coursesSearchWithOutPaging(keyword);
    for (let i = 0; i < result.length; i++) {
      let temp = await this.getAvgPointByCourseID(result[i].course_id);
      result[i].course_rv_point = temp[0].course_rv_point;
    }
    result.sort(function (a, b) {
      return b.course_rv_point - a.course_rv_point;
    });
    return result;
  },
};
