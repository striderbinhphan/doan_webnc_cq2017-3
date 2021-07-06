const express =require('express');
const  router  = express.Router();
const watchListModel = require('../models/watchlist.model');
const courseModel = require('../models/course.model')
const courseSubscribeModel = require('../models/coursesubscribe.model')

router.post("/watch-list",async(req,res)=>{
    const {accessTokenPayload} = req;
    const {course_id} = req.body;
    const validAdd  = await watchListModel.isValidOnce(accessTokenPayload.user_id,course_id);
    if(validAdd!==true){
        return res.json({message: "This course is already in your watch list before"});
    }
    await watchListModel.addNewWatchList(accessTokenPayload.user_id,course_id);
    res.status(201).json({message: "Added to your watch list"});
})

router.get("/watch-list/me",async (req,res)=>{
    const {accessTokenPayload} = req;
    const wList = await watchListModel.getWatchListByUserId(accessTokenPayload.user_id);
    const courseIds = wList.map(w=>w.course_id);
    let wListDetail = [];
    for(let i = 0 ; i<courseIds.length;i++){
        const course = await courseModel.getCourseById(courseIds[i]);
        wListDetail.push(course);
    }
    //reduceeeeeeeeeeee musted
    res.status(201).json(wListDetail);
})
router.delete("/watch-list",async (req,res)=>{
    const {accessTokenPayload} = req;
    const {courseId} = req.query;
    try{
        console.log(accessTokenPayload.user_id,courseId);
        const ret = await watchListModel.deleteWatchList(accessTokenPayload.user_id,courseId);
        //reduceeeeeeeeeeee musted
        res.status(201).json({message: "Remove course success from Watchlist"});
    }catch(err){
        return res.status(400).json({err:err});
    }
   
})
router.get("/course-subcribe",async (req,res)=>{
    const {accessTokenPayload} = req;
    const csList = await courseSubscribeModel.getCourseSubcribeList(accessTokenPayload.user_id);
    const courseIdList = csList.map(w=>w.course_id);
    let csListDetail = [];
    for(let i = 0 ; i<courseIdList.length;i++){
        const course = await courseModel.getCourseById(courseIdList[i]);
        csListDetail.push(course);
    }
    //reduceeeeeeeeeeee musted
    res.status(201).json(csListDetail);
})
//buying courses
router.post('/checkout',async (req,res)=>{
    const {accessTokenPayload} = req;
    const {courseIdList}  =req.body;
    if(courseIdList.length === null){
        return res.status(400).json({message:"empty cart"});
    }
    let purchasedCourseList = [];
    console.log(courseIdList);
    for(let i = 0; i < courseIdList.length ; i ++ ){
        const course = await courseModel.getCourseById(courseIdList[i]);
        const purchasedCourse = {};
        purchasedCourse.user_id = accessTokenPayload.user_id;
        purchasedCourse.course_id = courseIdList[i];
        // console.log(`Course id ${course.course_id}, course price/saleoff ${course.price}/${course.saleoff}`)
        purchasedCourse.purchased_date = new Date();
        purchasedCourse.purchased_total = (course.saleoff===null) ? course.price : course.price *(1-course.saleoff);
        // console.log(`purchased id `, JSON.stringify(purchasedCourse,null,2));
        purchasedCourseList.push(purchasedCourse);
    }
    await courseSubscribeModel.addMultiPurchasedCourse(purchasedCourseList);
    //other payment methods hereeeeeeeee, implementation later




    
    res.status(200).json({message: "Purchasing course  successfully"});
})
module.exports =router;