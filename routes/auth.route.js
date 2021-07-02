const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const randomString = require('randomstring');
const userModel  =require('../models/user.model')
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
module.exports = router;