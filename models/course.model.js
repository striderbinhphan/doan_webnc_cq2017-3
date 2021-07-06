const db = require('../utils/db');

module.exports = {
    async getCourseById(course_id){
        const cList = await db('course').where('course_id',course_id);
        if(cList.length === null){
            return null;
        }
        return cList[0];
    },
    addNewCourse(course){
        return db('course').insert(course);
    },
    uploadCourseImage(course_id, course_image){
        return db('course').where("course_id",course_id).update({
            course_image: course_image
        });
    }
}