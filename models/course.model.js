const db = require('../utils/db')
module.exports = {
    allCoursesForGuest(){
        return db('course');
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
        return db('course').where('course_id',id);
    },
    /* coursesSearch(keyword){
        return db('course').where('course_name', 'like',`%${keyword}%`).orderBy('last_update', 'asc')

    }, */
    coursesSearch(keyword,limit,offset){
        return db('course').where('course_name', 'like',`%${keyword}%`).orderBy('last_update', 'asc').limit(limit).offset(offset);

    },
    deleteCourse(course_id) {
        return db("course").where("course_id", course_id).del();
      },
    getFeedBack(course_id){
        return  db.select('review_id','review_feedback','user_id','timestamp').from('review').where('course_id',course_id);
    },
    getCourseOfLecture(lecture_id){
        return  db.select('course_name').from('course').where('user_id',lecture_id);
    }
}