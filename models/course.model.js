const db = require('../utils/db')
const config = require("../config/config.json");
const limit_of_page = config.LIMIT_OF_PAGE;

module.exports = {
    allCoursesForGuest(page){
        return db('course').limit(limit_of_page).offset((page-1)*limit_of_page);
    },
    allCoursesForAdmin() {
        return  db.select('course_id','course_name','course_title','category_id','user_id','saleoff','last_update','course_status').from('course');
      },
    webCourses(){
        return db('course').where('category_id',1);
    },
    mobileCourses(){
        return db('course').where('category_id',2);
    },
    getCourseById(id){
         const kq=db('course').where('course_id',id);
         return kq;
    },
    getCourseByCategory(category_id,page){
        return db('course').where('category_id',category_id).limit(limit_of_page).offset((page-1)*limit_of_page);
    },
    coursesSearch(keyword,page){
        console.log(limit_of_page);
        return db('course').where('course_name', 'like',`%${keyword}%`).orderBy('last_update', 'asc').limit(limit_of_page).offset((page-1)*limit_of_page);

    },
    deleteCourse(course_id) {
        return db("course").where("course_id", course_id).del();
      },
    getFeedBack(course_id){
        return  db.select('review_id','review_feedback','user_id','timestamp').from('review').where('course_id',course_id);
    },
    getCourseOfLecture(lecture_id){
        return  db.select('course_name').from('course').where('user_id',lecture_id);
    },
}