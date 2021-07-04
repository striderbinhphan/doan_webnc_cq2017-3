const db = require('../utils/db');

module.exports = {
    async getCourseById(course_id){
        const cList = await db('course').where('course_id',course_id);
        if(cList.length === null){
            return null;
        }
        return cList[0];
    }
}