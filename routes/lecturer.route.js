const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model')
const uploadFile = require('../services/fileupload.services')
const sectionModel = require('../models/section.model')
const multer = require('multer');
const videoModel = require('../models/video.model');
const STATUS_DONE = process.env.STATUS_DONE || "done";
const STATUS_NOTDONE = process.env.STATUS_NOTDONE || "notdone";
const path = require('path');
const fs = require('fs');

router.post('/courses',async (req,res)=>{
    const {accessTokenPayload} = req;
    const {name, shortDescription, description,categoryId, price, saleoff, sectionCount} = req.body;
    try{
        let course = {
            course_name: name,
            course_shortdescription: shortDescription,
            course_description: description,
            category_id:categoryId,
            user_id:  accessTokenPayload.user_id,
            price: price,
            saleoff: saleoff,
            section_count: sectionCount,
            course_status: STATUS_NOTDONE,
            last_update: new Date()
        };
        const courseAdded = await courseModel.addNewCourse(course);
        res.status(201).json({
            message: "Create new Course successfully",
            course_id: courseAdded[0]
        });
    }
    catch(err){
        return res.json({message:err}).status(204);
    }
})
const imageUpload = multer({storage: uploadFile('image')}).single('image');
router.patch('/courses-image',imageUpload,async (req,res)=>{
    const {accessTokenPayload} = req;
    const course_id = req.query.courseId;
    //deleting old course image
    const courseFromDB = await courseModel.getCourseById(course_id);
    if(courseFromDB.course_image !== null){
        const oldImagePath = path.join(path.resolve(__dirname,'..'), '/uploads/images/', courseFromDB.course_image) ;
        fs.unlinkSync(oldImagePath);
        console.log("deleted old image");
    }
    console.log(course_id);
    const course_image =req.file.filename;
    await courseModel.uploadCourseImage(course_id, course_image);
    res.status(201).json({message:"Upload course image successfully"});
})
router.post('/courses-section',async (req,res)=>{
    const {courseId,sections} = req.body;
    let newSections = [];
    
    if(sections.length ===0){
        return res.status(200).json({message:"Section empty"});
    }
    sections.forEach(s => {
        newSections.push({
            section_title: s,
            course_id: courseId
        })
    });
    console.log(newSections);
    try{
        const ret = await sectionModel.addNewSections(newSections);
        res.status(201).json({
            message:"Upload sections successfully"
        });
    }catch(err){
        return res.status(400).json({message:err});
    }
})
//create video first, return video id
router.post('/courses-video',async (req,res)=>{
    const {sectionId,videoTitle, videoPreviewStatus} = req.body;
    
    if(sectionId === null || videoTitle === null){
        return res.status(200).json({message:"Video title must be not empty"});
    }
    const newVideo = {
        video_title: videoTitle,
        preview_status: videoPreviewStatus,
        section_id: sectionId
    }
    try{
        const ret = await videoModel.addNewVideo(newVideo);
        res.status(201).json({
            message:"Upload video title successfully",
            video_id: ret[0]
        });
    }catch(err){
        return res.status(400).json({message:err});
    }
})
const uploadVideo = multer({storage:uploadFile("video")}).single("video");
router.patch('/courses-video',uploadVideo,async (req,res)=>{
    const {videoId} = req.query;
    const videoFromDB = await videoModel.getVideoByVideoId(videoId);
    if(videoFromDB.video_path !== null){
        const oldVideoPath = path.join(path.resolve(__dirname,'..'), '/uploads/videos/', videoFromDB.video_path) ;
        fs.unlinkSync(oldVideoPath);
        console.log("deleted old video");
    }
    await videoModel.updateVideo(videoId,req.file.filename);
    return res.status(200).json({message:"upload video successfully!"});
})
module.exports =router;