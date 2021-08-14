const db = require("../utils/db");
const limit_of_page = process.env.LIMIT_OF_PAGE;
const limit_of_newcourse = process.env.LIMIT_OF_NEWCOURSE;
const limit_of_hotcourse = process.env.LIMIT_OF_HOTCOURSE;
const limit_of_popularcourse = process.env.LIMIT_OF_POPULARCOURSE;

module.exports = {
  all() {
    return db("course");
  },
  async getCourseById(course_id) {
    const cList = await db("course").where("course_id", course_id);
    if (cList.length === 0) {
      return null;
    }
    console.log(cList[0]);
    return cList[0];
  },
  async getCourseByLecturerId(lecturerId) {
    const cList = await db("course").where("user_id", lecturerId);
    if (cList.length === 0) {
      return null;
    }
    return cList;
  },
  addNewCourse(course) {
    return db("course").insert(course);
  },
  uploadCourseImage(course_id, course_image) {
    return db("course").where("course_id", course_id).update({
      course_image: course_image,
    });
  },
  delete(courseId) {
    return db("course").where("course_id", courseId).del();
  },
  updateCourse(courseId, course) {
    return db("course").where("course_id", courseId).update(course);
  },
  allCoursesForGuest(page) {
    return db("course")
      .limit(limit_of_page)
      .offset((page - 1) * limit_of_page);
  },
  getAllByCategory(category_id) {
    return db("course").where("category_id", category_id);
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
  webCourses() {
    return db("course").where("category_id", 1);
  },
  mobileCourses() {
    return db("course").where("category_id", 2);
  },
  // getCourseById(id) {
  //   const kq = db("course").where("course_id", id);
  //   return kq;
  // },
  getCourseByCategory(category_id, page) {
    console.log("vao get course by id");
    return db("course")
      .where("category_id", category_id)
      .limit(limit_of_page)
      .offset((page - 1) * limit_of_page);
  },
  coursesSearchByPage(keyword, page) {
    return db("course")
      .where("course_name", "like", `%${keyword}%`)
      .orderBy("last_update", "asc")
      .limit(limit_of_page)
      .offset((page - 1) * limit_of_page);
  },
  coursesSearchAll(keyword) {
    return db("course")
      .where("course_name", "like", `%${keyword}%`)
      .orderBy("last_update", "asc");
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
  async searchAndSort(keyword, page) {
    result = await this.coursesSearchByPage(keyword, page);
    for (let i = 0; i < result.length; i++) {
      let temp = await this.getAvgPointByCourseID(result[i].course_id);
      result[i].course_rv_point = temp[0].course_rv_point;
    }
    result.sort(function (a, b) {
      return b.course_rv_point - a.course_rv_point;
    });
    return result;
  },
  getNewCourses() {
    return db("course")
      .orderBy("created_date", "desc")
      .limit(limit_of_newcourse)
  },
  async getHotCourses() {
    let course = await this.all();
    for (let i = 0; i < course.length; i++) {
      let temp = await this.getAvgPointByCourseID(course[i].course_id);
      course[i].course_rv_point = temp[0].course_rv_point?temp[0].course_rv_point:5;
    }
    course.sort(function (a, b) {
      return b.course_rv_point - a.course_rv_point;
    });
    const ret = course.slice(0, limit_of_hotcourse)
    return ret;
  },
  countSubcribeByCourseID(course_id) {
    return db("course_subscribe")
    .count('user_id',{as: 'Number_Of_Subcribe'})
    .where("course_id", course_id);
  },

  async getPopularCourses() {
    let course = await this.all();
    for (let i = 0; i < course.length; i++) {
      let temp = await this.countSubcribeByCourseID(course[i].course_id);
      course[i].Number_Of_Subcribe = temp[0].Number_Of_Subcribe;
    }
    course.sort(function (a, b) {
      return b.Number_Of_Subcribe - a.Number_Of_Subcribe;
    });
    const ret = course.slice(0, limit_of_popularcourse)
    return ret;
  },
};


