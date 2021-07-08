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
  /* get() {
      console.log("vao toi day");
      return (
        db("course")
          .join("review", "course.course_id", "=", "review.course_id")
          .select("*")
          .groupBy("course.course_id")
          // .orderBy('name', 'desc')
          .having("review.course_id", ">")
      );
    },
    test() {
      const kq = db("course").where({}).select("*");
      console.log("ket qua la:");
      console.log(kq);
      return kq;
    }, */
};
