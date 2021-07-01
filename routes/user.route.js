const express = require('express');
const userModel = require('../models/user.model');
const router  = express.Router();
router.get('/',async (req,res)=>{
    res.json(await userModel.all()).end();
})
module.exports = router;