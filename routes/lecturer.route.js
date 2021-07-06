const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model')
const uploadFile = require('../services/fileupload.services')
const sectionModel = require('../models/section.model')
const multer = require('multer');
const STATUS_DONE = process.env.STATUS_DONE || "done";
const STATUS_NOTDONE = process.env.STATUS_NOTDONE || "notdone";

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
module.exports =router;