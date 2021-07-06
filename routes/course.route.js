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
const {userGuard, lecturerGuard} = require('../middlewares/auth.mdw')
/*

------------
course api
------------

*/
router.post('/',lecturerGuard,async (req,res)=>{
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
router.patch('/:courseId/image',lecturerGuard,imageUpload,async (req,res)=>{
    const {accessTokenPayload} = req;
    const course_id = req.params.courseId;
    //deleting old course image
    const courseFromDB = await courseModel.getCourseById(course_id);
    if(courseFromDB.course_image !== null){
        DeleteImageFile([courseFromDB.course_image]);
    }
    //console.log(course_id);
    const course_image =req.file.filename;
    await courseModel.uploadCourseImage(course_id, course_image);
    res.status(201).json({message:"Upload course image successfully"});
})

router.delete('/:courseId',lecturerGuard,async (req,res)=>{
    try{
        const courseId =req.params.courseId;
        const courseSections = await sectionModel.getAllSectionByCourseId(courseId);
        if(courseSections !==null){
            const sectionIdList =  courseSections.map(s=>s.section_id);

            //console.log(sectionIdList);
            if(sectionIdList.length!==0){
                for(let i=0;i<sectionIdList.length;i++){
                    //get video from db
                    let videos = await videoModel.getAllVideoBySectionId(sectionIdList[i]);
                    if(videos.length !==0){
                        //console.log(videos);
                        //get video path if not null to delete
                        let videoPaths = videos.map(v=>v.video_path).filter(v=>(v.video_path !== null));
                        //console.log(videoPaths);
                        if(videoPaths.length!==0){
                            //console.log("video path not empty")
                            DeleteVideoFile(videoPaths);
                        }
                    }
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

module.exports =router;