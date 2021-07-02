const express = require('express');
const guestModel = require('../models/guest.model');
const router  = express.Router();
router.get('/courses',async (req,res)=>{
    res.json(await guestModel.allCourses()).end();
})
router.get('/web-courses',async (req,res)=>{
    res.json(await guestModel.webCourses()).end();
})
router.get('/mobile-courses',async (req,res)=>{
    res.json(await guestModel.mobileCourses()).end();
})
router.get('/courses/detail/:id',async (req,res)=>{
    const id = +req.params.id;
    res.json(await guestModel.getCourseById(id)).end();
})
router.get('/courses/:keyword',async (req,res)=>{
    const keyword = req.params.keyword;
    res.json(await guestModel.coursesSearch(keyword)).end();
})
module.exports = router;