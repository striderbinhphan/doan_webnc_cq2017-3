const express = require('express')
const router = express.Router()
const reviewModel  = require('../models/review.model')
const userModel = require('../models/user.model')
const {useGuard, userGuard}  = require('../middlewares/auth.mdw')
router.get('/:courseId',async(req,res)=>{
    const courseId = req.params.courseId;
    const reviews = await reviewModel.getCourseReviews(courseId);
    if(reviews.length === 0) {
        return res.status(204).json({message: "Course has no any reviews"});
    }
    const averageRating = reviews.map((r)=>r.review_rating).reduce((a,b)=>a+b)/reviews.length;
    for(let i = 0 ;i < reviews.length ; i++){
        let user = await userModel.isExistByUserId(reviews[i].user_id);
        reviews[i].userFullName = user.user_name;
    }
    console.log(averageRating);
    console.log(reviews);
    res.status(200).json({
        averageRating: averageRating,
        reviews: reviews
    });
})
router.post('/',userGuard,async (req,res)=>{
    const {accessTokenPayload} = req;
    const {feedback,rating,courseId} = req.body;
    const timestamp = new Date();
    try{
        const ret = await reviewModel.addNewReview(feedback,rating,accessTokenPayload.user_id,courseId,timestamp);
        return res.status(200).json({message: "Sent feedback successfully"});   
    }catch(err){
        return res.json({message:err});
    }
})
module.exports = router;