const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model')
const uploadFile = require('../services/fileupload.services')
const sectionModel = require('../models/section.model')
const multer = require('multer');
const videoModel = require('../models/video.model');
const STATUS_DONE = process.env.STATUS_DONE || "done";
const STATUS_NOTDONE = process.env.STATUS_NOTDONE || "notdone";
const {DeleteImageFile, DeleteVideoFile} = require('../services/file.services')
/*

------------
course api
------------

*/
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
            courseId: courseAdded[0]
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
        DeleteImageFile([courseFromDB.course_image]);
    }
    console.log(course_id);
    const course_image =req.file.filename;
    await courseModel.uploadCourseImage(course_id, course_image);
    res.status(201).json({message:"Upload course image successfully"});
})

router.delete('/courses/:courseId',async (req,res)=>{
    try{
        const courseId =req.params.courseId;
        const courseSections = await sectionModel.getAllSectionByCourseId(courseId);
        const sectionIdList =  courseSections.map(s=>s.section_id);

        console.log(sectionIdList);
        if(sectionIdList.length!==0){
            for(let i=0;i<sectionIdList.length;i++){
                //get video from db
                let videos = await videoModel.getAllVideoBySectionId(sectionIdList[i]);
                console.log(videos);
                //get video path if not null to delete
                let videoPaths = videos.map(v=>v.video_path).filter(v=>(v.video_path !== null));
                console.log(videoPaths);
                if(videoPaths.length!==0){
                    console.log("video path not empty")
                    DeleteVideoFile(videoPaths);
                }
            }
        }
    
        const courseFromDB = await courseModel.getCourseById(courseId);
        if(courseFromDB.course_image !== null){
            DeleteImageFile([courseFromDB.course_image]);
        }
        await courseModel.delete(courseId);
        res.status(200).json({message:"Delete course successfully"});
    }catch(err){
        return res.status(400).json({message:err});
    }
    
})
/*

------------
course section api
------------

*/

router.post('/courses-section',async (req,res)=>{
    const {courseId,sectionTitle} = req.body;
    const newSection = {
        section_title: sectionTitle,
        course_id: courseId
    }
    try{
        const ret = await sectionModel.addNewSections(newSection);
        res.status(201).json({
            message:"Upload sections successfully",
            sectionId: ret[0]
        });
    }catch(err){
        return res.status(400).json({message:err});
    }
})


//update course section info
router.patch('/courses-section',async (req,res)=>{
    const {sectionId, sectionTitle} = req.body;
    
    try{
        const ret = await sectionModel.updateSection(sectionId,sectionTitle);
        res.status(201).json({
            message:"Upload sections successfully"
        });
    }catch(err){
        return res.status(400).json({message:err});
    }
})

router.delete('/courses-section/:sectionId',async(req,res)=>{
    const sectionId = +req.params.sectionId;
    
    const section = await sectionModel.getSectionBySectionId(sectionId);
    if(section === null){
        return res.status(400).json({message: "section id not found"});
    }
    //get video from db
    const videos = await videoModel.getAllVideoBySectionId(sectionId);
    //get video path if not null to delete
    const videoPaths = videos.map(v=>v.video_path).filter(v=>(v.video_path !== null));

    if(videoPaths.length!==0){
        
        DeleteVideoFile(videoPaths);
    }
    try{
        
        await sectionModel.deleteSection(sectionId);
        res.status(200).json({message: "Delete section successfully"});
    }catch(err){
        return res.status(400).json({message:err});
    }
})
/*

------------
course video api
------------

*/


//create video first, return video id
router.post('/courses-video-title',async (req,res)=>{
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

//create video first, return video id
router.patch('/courses-video-title',async (req,res)=>{
    const {videoId,videoTitle,videoPreviewStatus} = req.body;
    
    if( videoTitle === null){
        return res.status(200).json({message:"Video title must be not empty"});
    }
    const updateVideoTitle = {
        video_title: videoTitle,
        preview_status: videoPreviewStatus
    }
    try{
        const ret = await videoModel.updateVideoTitle(videoId,updateVideoTitle);
        res.status(201).json({
            message:"Update video title successfully"
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
        DeleteVideoFile([videoFromDB.video_path]);
    }
    await videoModel.updateVideo(videoId,req.file.filename);
    return res.status(200).json({message:"upload video successfully!"});
})


router.delete('/courses-video/:videoId',async (req,res)=>{
    const videoId = req.params.videoId;
    const videoFromDB = await videoModel.getVideoByVideoId(videoId);
    if(videoFromDB.video_path !== null){
        DeleteVideoFile([videoFromDB.video_path]);
    }
    await videoModel.delete(videoId);
    return res.status(200).json({message:"upload video successfully!"});
})

module.exports =router;