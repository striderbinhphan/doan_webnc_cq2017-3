const express =require('express');
const  router  = express.Router();
const watchListModel = require('../models/student.model')
router.post("/watch-list",async(req,res)=>{
    const {user_id, course_id} = req.body;
    const result = await watchListModel.addNewWatchList(user_id,course_id);
    res.status(201).json(result);
})

router.post("/update-info",(req,res)=>{
    const user_id = req.body;
    res.status(201).json({
        status: "update successfully!"
    }).end();
})
module.exports =router;