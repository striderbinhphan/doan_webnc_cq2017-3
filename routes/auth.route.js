const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const randomString = require('randomstring');
const userModel  =require('../models/user.model')
const authServices = require('../services/auth.services')
router.get('/',(req,res)=>{
    res.json({hello: "hello from auth services"});
})
router.post('/login',async (req,res)=>{
    const user =await userModel.getSingleUser(req.body.username);
    if(user === null){
        res.status(400).json({
            authenticated: false,
        })
    }
    if(!bcrypt.compareSync(req.body.password,user.user_password)){
        res.status(400).json({
            authenticated: false,
        })
    }
    const payload = {
        userID: user.user_id,
        username: user.user_username
    }
    const opts = {
        expiresIn: 5 * 60 
    }
    const accessToken = jwt.sign(payload,'BINHPHAN',opts);
    const refreshToken = randomString.generate(128);
    await userModel.addRFTokenToDB(user.user_id,refreshToken);
    return res.json({
        authenticated: true,
        accessToken,
        refreshToken
    });
})
router.post('/register',async(req,res)=>{
    const user = req.body;
    //console.log(user);
    const isExistUsername =await userModel.isExistUsername(req.body.user_username);
    if(isExistUsername !== null){
        return res.status(400).json({
            status: "username is created! try another username",
        })
    }
    const isExistEmail =await userModel.isExistEmail(req.body.user_email);
    if(isExistEmail !== null){
        return res.status(400).json({
            status: "email is exist! try another email",
        })
    }
    
    user.user_status = "verify";
    user.user_role = "student";
    const otpCode = authServices.generateOTPCode();
    const otpToken = authServices.generateOTPToken(otpCode);
    console.log(otpCode,otpToken,authServices.checkOTPValid(otpCode,otpToken));

    
    // user.user_password = bcrypt.hashSync(user.user_password,10);
    // const ret = await userModel.addNewUser(user);
    
    // user.user_id = ret[0];
    // delete user.user_password;
    // console.log(user);
    // res.status(201).json(user);
    res.status(201).json({
        otpCode,
        otpToken
    });
})
module.exports = router;