const express = require('express');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs')
const router  = express.Router();
router.get('/',async (req,res)=>{
    res.json(await userModel.all()).end();
});
router.post('/register',async(req,res)=>{
    const user = req.body;
    const isExist =await userModel.getSingleUser(req.body.user_username);
    if(isExist !== null){
        res.status(400).json({
            register: "username is created! try another username",
        })
    }
    user.user_role = "student";
    console.log(user);
    user.user_password = bcrypt.hashSync(user.user_password,10);
    const  ret = await userModel.addNewUser(user);
    
    user.user_id = ret[0];
    delete user.user_password;
    console.log(user);
    return res.status(201).json(user);
})
module.exports = router;