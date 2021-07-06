const express = require('express');
const courseModel = require('../models/course.model');
const router  = express.Router();
router.get('/',async (req,res)=>{
    res.json(await courseModel.allCoursesForGuest()).end();
})
router.get('/web-courses',async (req,res)=>{
    res.json(await courseModel.webCourses()).end();
})
router.get('/mobile-courses',async (req,res)=>{
    res.json(await courseModel.mobileCourses()).end();
})
router.get('/detail/:id',async (req,res)=>{
    const id = +req.params.id;
    res.json(await courseModel.getCourseById(id)).end();
})
router.get('/:keyword/:limit/:offset',async (req,res)=>{
    const {keyword,limit,offset} = req.params;
    res.json(await courseModel.coursesSearch(keyword,limit,offset)).end();
})
router.post('/delete',async (req,res)=>{
    const course_id= +req.body.course_id;
    res.json(await courseModel.deleteCourse(course_id)).end();
})
router.get('/feedback/:id',async (req,res)=>{
    const id= + req.params.id;
    res.json(await courseModel.getFeedBack(id)).end();
})
module.exports = router;