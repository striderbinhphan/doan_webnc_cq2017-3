const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const randomString = require('randomstring');
const userModel  =require('../models/user.model')
const authServices = require('../services/auth.services')

const STATUS_VERIFY = process.env.STATUS_VERIFY || "verify";
const STATUS_ACTIVE = process.env.STATUS_ACTIVE || "active";
const STATUS_UPDATE = process.env.STATUS_UPDATE || "update";
const SECRET_KEY = process.env.SECRET_KEY || "HCMUSWEBNC";

router.get('/',(req,res)=>{
    res.json({hello: "hello from auth services"});
})
router.post('/login',async (req,res)=>{
    const user =await userModel.isExistByUsername(req.body.username);
    if(user === null){
        res.status(200).json({
            authenticated: false,
        })
    }
    if(user.user_status === STATUS_VERIFY){
        return res.status(200).json({
            status: "Please verify your account! Try again",
        })
    }
    if(!bcrypt.compareSync(req.body.password,user.user_password)){
        res.status(200).json({
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
    const accessToken = jwt.sign(payload,SECRET_KEY,opts);
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
    const isExistUsername =await userModel.isExistByUsername(req.body.user_username);
    if(isExistUsername !== null){
        return res.status(200).json({
            status: "username is created! try another username",
        })
    }
    const isExistEmail =await userModel.isExistByEmail(req.body.user_email);
    if(isExistEmail !== null){
        return res.status(200).json({
            status: "email is exist! try another email",
        })
    }
    
    user.user_status = STATUS_VERIFY;
    user.user_role = "student";

    const otpCode = authServices.generateOTPCode();
    const otpToken = authServices.generateOTPToken(otpCode);
    console.log(otpCode,otpToken,authServices.checkOTPValid(otpCode,otpToken));
    const result = await authServices.sendMail(req.body.user_email,otpCode);
    console.log(result);
    user.user_accessotp = otpToken;
    user.user_password = bcrypt.hashSync(user.user_password,10);
    const ret = await userModel.addNewUser(user);
    
    user.user_id = ret[0];
    delete user.user_password;
    delete user.user_accessotp;
    delete user.user_status;
    res.status(201).json(user);
})
router.post('/verify',async(req,res)=>{
    const {user_email,user_otp} = req.body;
    const user = await userModel.isExistByEmail(user_email);
    if(user === null){
        return res.status(200).json({
            status: "Email isn't exist in our services, pls register first",
        })
    }
    if(user.user_status !== STATUS_VERIFY){
        return res.status(200).json({
            status: "Email was activated",
        })
    }
    if(!authServices.checkOTPValid(user_otp,user.user_accessotp)){
        return res.status(200).json({status: "OTP expired/wrong, resend/check OTP again"});
    }
    await userModel.updateUserStatus(user_email,STATUS_ACTIVE);
    res.status(201).json({status: `Verifying ${user_email} successfully`});
})
router.post('/resend',async(req,res)=>{
    const {user_email} = req.body;
    const user = await userModel.isExistByEmail(user_email);
    if(user === null){
        return res.status(200).json({
            status: "Email isn't exist in our services, pls register first",
        })
    }
    if(user.user_status !== STATUS_VERIFY){
        return res.status(200).json({
            status: "Email had been activated",
        })
    }
    const otpCode = authServices.generateOTPCode();
    const otpToken = authServices.generateOTPToken(otpCode);
    console.log(otpCode,otpToken,authServices.checkOTPValid(otpCode,otpToken));
    await userModel.addOTPTokenToDB(user_email,otpToken);
    const result = await authServices.sendMail(req.body.user_email,otpCode);
    res.status(200).json({status:"OTP 's sent to your email! Check"});
})
module.exports = router;