const express = require('express');
const router = express.Router();
const uploadFile = require('../services/fileupload.services')
const courseModel = require('../models/course.model')
const sectionModel = require('../models/section.model')
const courseSubscribeModel  = require('../models/coursesubscribe.model')
const multer = require('multer');
const videoModel = require('../models/video.model');
const STATUS_DONE = process.env.STATUS_DONE || "done";
const STATUS_NOTDONE = process.env.STATUS_NOTDONE || "notdone";
const {DeleteImageFile, DeleteVideoFile} = require('../services/file.services')
const {userGuard, lecturerGuard,adminGuard, roleVerify} = require('../middlewares/auth.mdw')

const ROLE_GUEST = process.env.ROLE_GUEST || "guest"
const ROLE_STUDENT = process.env.ROLE_STUDENT || "student"
const ROLE_LECTURER = process.env.ROLE_LECTURER || "lecturer"
const ROLE_ADMIN = process.env.ROLE_ADMIN || "admin"

/*

------------
course api
------------

*/
router.get('/',roleVerify,async(req,res)=>{ 
    const {accessTokenPayload} = req;
    const courseList = await courseModel.all();
    if(courseList === null){
        return res.status(200).json({message: "Course empty"})
    }
    const resCourseList = await  setCourse(accessTokenPayload.user_id,accessTokenPayload.user_role,courseList);
    res.status(200).json(resCourseList);
})
router.get('/me',lecturerGuard,async(req,res)=>{ 
    const {accessTokenPayload} = req;
    const courseList = await courseModel.getCourseByLecturerId(accessTokenPayload.user_id);
    if(courseList === null){
        return res.status(200).json({message: "You hadn't been post any course before"})
    }
    res.status(200).json(courseList);
})
router.get('/:courseId',roleVerify,async(req,res)=>{ 
    const courseId =req.params.courseId;
    const {accessTokenPayload} = req;
    const course =await courseModel.getCourseById(courseId);
    if(course === null){
        return res.status(200).json({message: "Course id not found"});
    }
    const resCourse =await setCourse(accessTokenPayload.user_id,accessTokenPayload.user_role,[course]);
    res.status(200).json(resCourse[0]);
})
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

router.delete('/:courseId',adminGuard,async (req,res)=>{
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

//return course list with access permission base on role and userID
async function setCourse(userId, role, courses){
    const responseCourses = [];
    for(let i=0;i<courses.length;i++){
        let singleCourse =await getCourseDetail(courses[i]);
        //permission = guest,  this course lecturer, student not buy this courses => preview mode
        if(role === ROLE_GUEST){
            singleCourse.isView = false;
            singleCourse.isEdit = false;
            singleCourse.isDelete = false;
            responseCourses.push(singleCourse);
        }else{
            const isUserPurchasedCourse = await courseSubscribeModel.checkIsPurchasedCourse(userId,singleCourse.course_id);
            // console.log(userId,singleCourse.course_id);
            // console.log(isUserPurchasedCourse);
            if(isUserPurchasedCourse===false && singleCourse.user_id!==userId){
                //console.log("guest mode");
                singleCourse.isView = false;
                singleCourse.isEdit = false;
                singleCourse.isDelete = false;
                responseCourses.push(singleCourse);
            }
            else{
                if(role === ROLE_ADMIN){
                    singleCourse.isView = true;
                    singleCourse.isEdit = true;
                    singleCourse.isDelete = true;
                    responseCourses.push(singleCourse);
                }else if(role === ROLE_LECTURER){
                    singleCourse.isView = true;
                    singleCourse.isEdit = true;
                    singleCourse.isDelete = false;
                    responseCourses.push(singleCourse);
                }else{
                    singleCourse.isView = true;
                    singleCourse.isEdit = false;
                    singleCourse.isDelete = false;
                    responseCourses.push(singleCourse);
                }
            }
        }
    }
    return responseCourses;
    
}
async function getCourseDetail(course){
    const courseSections = await sectionModel.getAllSectionByCourseId(course.course_id);
    //console.log(courseSections);
    if(courseSections !==null){
        for(let i=0;i<courseSections.length;i++){
            //get video from db
            let videos = await videoModel.getAllVideoBySectionId(courseSections[i].section_id);
            courseSections[i].videos = videos;
        }
    }
    course.sections = courseSections;
    return course;
}


module.exports =router;