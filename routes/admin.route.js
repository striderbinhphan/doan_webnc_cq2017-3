const express = require('express');
const adminModel = require('../models/admin.model');
const router  = express.Router();
router.post('/delete-user',async (req,res)=>{
    const user_id= +req.body.user_id;
    res.json(await adminModel.deleteUser(user_id)).end();
})
router.post('/delete-course',async (req,res)=>{
    const course_id= +req.body.course_id;
    res.json(await adminModel.deleteCourse(course_id)).end();
})


router.post('/add-category',async (req,res)=>{
    const { category_name, subject_id} = req.body;
    const category = {
        category_name,
        subject_id
      };
    res.json(await adminModel.addCategory(category)).end();
})

router.post('/add-lecture',async (req,res)=>{
    const { user_name, user_firstname,user_lastname,user_password,user_email,user_dob,user_role,refresh_token} = req.body;
    const lecture = {
         user_name,
         user_firstname,
         user_lastname,
         user_password,
         user_email,
         user_dob,
         user_role: "lecture",
         refresh_token
      };
    res.json(await adminModel.addLecture(lecture)).end();
})
router.get('/all-learner',async (req,res)=>{
    res.json(await adminModel.allLearner()).end();
})
router.get('/all-lecture',async (req,res)=>{
    res.json(await adminModel.allLecture()).end();
})
router.get('/all-courses',async (req,res)=>{
    res.json(await adminModel.allCourses()).end();
})
/* router.get('/all-category',async (req,res)=>{
    res.json(await adminModel.allCategory()).end();
}) */


module.exports = router;