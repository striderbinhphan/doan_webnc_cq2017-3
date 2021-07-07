const db = require('../utils/db');

module.exports = {
    all(){
        return db('course');
    },
    async getCourseById(course_id){
        const cList = await db('course').where('course_id',course_id);
        if(cList.length === 0){
            return null;
        }
        return cList[0];
    },
    async getCourseByLecturerId(lecturerId){
        const cList = await db('course').where('user_id',lecturerId);
        if(cList.length === 0){
            return null;
        }
        return cList;
    },
    addNewCourse(course){
        return db('course').insert(course);
    },
    uploadCourseImage(course_id, course_image){
        return db('course').where("course_id",course_id).update({
            course_image: course_image
        });
    },
    delete(courseId){
        return db('course').where('course_id',courseId).del();
    }
}