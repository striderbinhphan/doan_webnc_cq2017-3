const db = require("../utils/db")
module.exports  = {
    getCourseReviews(courseId)
    {
        return db("review").where("course_id",courseId);
    },
    addNewReview(feedback, rating, userId, courseId,timestamp){
        return db("review").insert({
            review_feedback: feedback,
            review_rating: rating,
            course_id: courseId,
            user_id: userId,
            timestamp: timestamp
        })
    }
} 