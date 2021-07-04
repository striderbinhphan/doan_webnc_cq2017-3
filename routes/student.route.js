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
        return res.json({status: "This course is already in your watch list before"});
    }
    await watchListModel.addNewWatchList(accessTokenPayload.user_id,course_id);
    res.status(201).json({status: "Added to your watch list"});
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
        res.status(201).json({status: "Remove course success from Watchlist"});
    }catch(err){
        return res.status(400).json({err:err});
    }
   
})
router.get("/course-subcribe",async (req,res)=>{
    const {accessTokenPayload} = req;
    const csList = await courseSubscribeModel.getCourseSubcribeList(accessTokenPayload.user_id);
    const courseIds = csList.map(w=>w.course_id);
    let csListDetail = [];
    for(let i = 0 ; i<courseIds.length;i++){
        const course = await courseModel.getCourseById(courseIds[i]);
        csListDetail.push(course);
    }
    //reduceeeeeeeeeeee musted
    res.status(201).json(csListDetail);
})
module.exports =router;