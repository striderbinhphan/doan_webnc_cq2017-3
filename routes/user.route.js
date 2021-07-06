const express = require('express');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs')
const router  = express.Router();
const jwt  = require('jsonwebtoken');
const randomString = require('randomstring');
const authServices = require('../services/auth.services')

const STATUS_VERIFY = process.env.STATUS_VERIFY || "verify";
const STATUS_ACTIVE = process.env.STATUS_ACTIVE || "active";
const STATUS_UPDATE = process.env.STATUS_UPDATE || "update";

const SECRET_KEY = process.env.SECRET_KEY || "HCMUSWEBNC";

router.get('/me',async (req,res)=>{
    const {accessTokenPayload} = req;
    const user = await userModel.isExistByUsername(accessTokenPayload.user_username);
    res.json({
        username: user.user_username,
        fullname: user.user_name,
        firstname: user.user_firstname,
        lastname: user.user_lastname,
        email: user.user_email,
        dob: user.user_dob
    }).end();
});
router.patch('/update-info',async(req,res)=>{
    const {fullname,firstname,lastname,dob}= req.body;
    const user = {
        user_name:fullname,
        user_firstname: firstname,
        user_lastname:lastname,
        user_dob:dob
    }
    console.log(user);
    const {accessTokenPayload} = req;
    try{
        await userModel.updateUserInfo(accessTokenPayload.user_username,user)
        console.log(user);
        res.status(200).json({
            message: "update user info success",
        });
    }catch(err){
        return res.status(400).json({
            message: err,
        });
    }
})
router.patch('/update-email',async(req,res)=>{
    const {newEmail}= req.body;
    const {accessTokenPayload} = req;
    const isExistUser = await userModel.isExistByEmail(newEmail);
    if(isExistUser !== null){
        return res.status(200).json({message:"this email has been used! try another"});
    }
    

    const otpCode = authServices.generateOTPCode();
    const otpToken = authServices.generateOTPToken(otpCode);
    //console.log(otpCode,otpToken,authServices.checkOTPValid(otpCode,otpToken));
    const result = await authServices.sendMail(newEmail,otpCode);
    //console.log(result);
    const user = {
        user_accessotp : otpToken,
        user_status : STATUS_UPDATE,
        user_email : newEmail
    }
    
    await userModel.updateEmail(accessTokenPayload.user_username,user);
    res.status(201).json({message:"Update email success. Check your email to verify new Email"});
})
router.patch('/update-password',async(req,res)=>{
    const {oldPassword, newPassword}= req.body;
    const {accessTokenPayload} = req;
    const user = await userModel.isExistByUsername(accessTokenPayload.user_username);
    if(user === null){
        return res.status(200).json({message:"Some thing wrong, try again"});
    }
    if(!bcrypt.compareSync(oldPassword,user.user_password)){
        return res.status(200).json({message:"Old password wrong!"});
    }
    //console.log(newPassword);
    const hashNewPassword = bcrypt.hashSync(newPassword,10);
    //console.log(hashNewPassword);

    await userModel.updatePassword(accessTokenPayload.user_username, hashNewPassword);
    res.status(201).json({message:"Update password success."});
})

module.exports = router;