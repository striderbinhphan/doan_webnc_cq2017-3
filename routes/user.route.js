const express = require('express');
const userModel = require('../models/user.model');
const router  = express.Router();
router.post('/delete-user',async (req,res)=>{
    const user_id= +req.body.user_id;
    res.json(await userModel.deleteUser(user_id)).end();
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
    res.json(await userModel.addLecture(lecture)).end();
})
router.get('/all-learner',async (req,res)=>{
    res.json(await userModel.allLearner()).end();
})
router.get('/all-lecture',async (req,res)=>{
    res.json(await userModel.allLecture()).end();
})
module.exports = router;