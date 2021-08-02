const express = require('express');
const router = express.Router();
const uploadFile = require('../services/fileupload.services')
const courseModel = require('../models/course.model')
const sectionModel = require('../models/section.model')
const reviewModel = require('../models/review.model')
const userModel = require("../models/user.model")
const courseSubscribeModel  = require('../models/coursesubscribe.model')
const watchListModel  =require('../models/watchlist.model');
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

// router.get('/',async (req,res)=>{
//    const page = +req.query.page;
//    const courseList = await courseModel.allCoursesForGuest(page);
//    if(courseList.length === 0){
//        return res.status(204).end();
//    }
//     res.status(200).json((courseList)).end();
// })
router.get('/category/web-courses',async (req,res)=>{
   const page = +req.query.page;
   const courseList = await courseModel.webCourses(page);
   if(courseList.length === 0){
       return res.status(204).end();
   }
    res.status(200).json((courseList)).end();
})

router.get('/category/mobile-courses',async (req,res)=>{
    const page = +req.query.page;
    const courseList = await courseModel.mobileCourses(page);
    if(courseList.length === 0){
        return res.status(204).end();
    }
     res.status(200).json((courseList)).end();
 })
 

router.get('/detail/:id',async (req,res)=>{
    const id = +req.params.id;
    const course = await courseModel.getCourseById(id);
    if(course.length === 0){
        return res.status(204).end();
    }  
    res.status(200).json(course[0]).end();
})

router.delete('/delete',async (req,res)=>{
    const course_id= +req.body.course_id;
    res.status(200).json( await courseModel.deleteCourse(course_id)).end;
})

router.get('/feedback/:id',async (req,res)=>{
    const id= + req.params.id;
    const result = await courseModel.getFeedBack(id);
    if(result.length === 0){
        return res.status(204).end();
    }  
    res.status(200).json(result).end();
})
router.get('/query',async (req,res)=>{
    const search = req.query.search;
    const page = +req.query.page;
    const result = await courseModel.coursesSearch(search,page);
    if(result.length === 0){
        return res.status(204).end();
    }  
    res.status(200).json(result).end();
})

router.get('/category',async (req,res)=>{
    const category_id= +req.query.id;
    const page= +req.query.page;
    const result = await courseModel.getCourseByCategory(category_id,page);
    if(result.length === 0){
        return res.status(204).end();
    }  
    res.status(200).json(result).end();
})
router.get('/search',async(req,res)=>{
    const key = req.query.key;
    const ret= await courseModel.searchAndSort(key);
    res.status(200).json(ret).end();
})
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
    //console.log(courseId);
    const {accessTokenPayload} = req;
    console.log(accessTokenPayload);
    const course =await courseModel.getCourseById(courseId);
    if(course === null){
        return res.status(204).json({message: "Course id not found"});
    }
    //console.log([course]);
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
            course_status: false,
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
router.patch('/:courseId',lecturerGuard,async (req,res)=>{
    const courseId = req.params.courseId;
    const {name, shortDescription, description,categoryId, price, saleoff, sectionCount, courseStatus} = req.body;
    const {accessTokenPayload} = req;
    const course = await courseModel.getCourseById(courseId);
    if(course === null){
        return res.status(400).json({message: "Course not found"});
    }
    if(course.user_id!==accessTokenPayload.user_id){
        return res.status(401).json({message: "You do not have permission to modify this course"});
    }
    try{
        let updatedCourse = {
            course_name: name,
            course_shortdescription: shortDescription,
            course_description: description,
            category_id:categoryId,
            price: price,
            saleoff: saleoff,
            section_count: sectionCount,
            course_status: courseStatus,
            last_update: new Date()
        };
        const courseAdded = await courseModel.updateCourse(courseId,updatedCourse);
        res.status(200).json({
            message: "Update course successfully"
        });
    }
    catch(err){
        return res.status(400).json({message:err});
    }
})
router.patch('/:courseId/status',lecturerGuard,async (req,res)=>{
    const courseId = req.params.courseId;
    const {courseStatus} = req.body;
    const {accessTokenPayload} = req;
    const course = await courseModel.getCourseById(courseId);
    if(course === null){
        return res.status(400).json({message: "Course not found"});
    }
    if(course.user_id!==accessTokenPayload.user_id){
        return res.status(401).json({message: "You do not have permission to modify this course"});
    }
    try{
        let updatedCourse = {
            course_status: courseStatus,
            last_update: new Date()
        };
        const courseAdded = await courseModel.updateCourse(courseId,updatedCourse);
        res.status(200).json({
            message: "Update status course successfully"
        });
    }
    catch(err){
        return res.status(400).json({message:err});
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
    let user = await userModel.isExistByUserId(course.user_id);
    course.lecturer = user.user_name;
    course.totalWishList  = await watchListModel.getTotalWishList(course.course_id);
    course.totalStudent  = await courseSubscribeModel.getTotalStudents(course.course_id);
    //console.log(courseSections);
    if(courseSections !==null){
        for(let i=0;i<courseSections.length;i++){
            //get video from db
            let videos = await videoModel.getAllVideoBySectionId(courseSections[i].section_id);
            courseSections[i].videos = videos;
        }
    }
    course.sections = courseSections;
    
    const reviews = await reviewModel.getCourseReviews(course.course_id);
    if(reviews.length === 0) {
        course.totalReview = 0;
        course.averageRating = 5;
        // course.reviews = [];
        return course;
    }
    // for(let i = 0 ;i < reviews.length ; i++){
    //     let user = await userModel.isExistByUserId(reviews[i].user_id);
    //     reviews[i].userFullName = user.user_name;
    // }
    // course.reviews = reviews;


    const averageRating = reviews.map((r)=>r.review_rating).reduce((a,b)=>a+b)/reviews.length;
    
    course.totalReview = reviews.length;
    course.averageRating = averageRating;
    return course;
}


module.exports =router;

