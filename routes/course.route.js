const express = require('express');
const courseModel = require('../models/course.model');
const router  = express.Router();
router.get('/page/:page',async (req,res)=>{
    const page = +req.params.page;
    res.json(await courseModel.allCoursesForGuest(page)).end();
})
router.get('/:id',async (req,res)=>{
    const course_id = +req.params.id;
    res.json(await courseModel.getCourseById(course_id)).end();
})

router.get('/:category_id/:page',async (req,res)=>{
    const category_id= +req.params.category_id;
    const page= +req.params.page;
    res.json(await courseModel.getCourseByCategory(category_id,page)).end();
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
router.get('/:search/:page',async (req,res)=>{
    const keyword = req.params.search;
    const page = +req.params.page;
    res.json(await courseModel.coursesSearch(keyword,page)).end();
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