const express = require('express');
const courseModel = require('../models/course.model');
const router  = express.Router();
router.get('/',async (req,res)=>{
   const page = +req.query.page;
   const courseList = await courseModel.allCoursesForGuest(page);
   if(courseList.length === 0){
       return res.status(204).end();
   }
    res.status(200).json((courseList)).end();
})
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
module.exports = router;