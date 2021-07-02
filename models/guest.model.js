const db = require('../utils/db')
module.exports = {
    allCourses(){
        return db('course');
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
    coursesSearch(keyword){
        return db('course').where('course_name', 'like',`%${keyword}%`)
    }

}