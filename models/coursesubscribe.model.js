const db = require('../utils/db');

module.exports = {
    getCourseSubcribeList(user_id){
        return db('course_subscribe').where('user_id',user_id);
        
    },
    addMultiPurchasedCourse(purchasedCourseList){
        return db('course_subscribe').insert([...purchasedCourseList]);
    }
}