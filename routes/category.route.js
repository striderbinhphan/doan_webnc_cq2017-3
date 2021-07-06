const express = require('express');
const adminModel = require('../models/user.model');
const categoryModel = require('../models/category.model');
const router  = express.Router();
router.get('/',async (req,res)=>{
    res.json(await categoryModel.allCategory()).end();
})
router.get('/:id',async (req,res)=>{
    const id = +req.params.id;
    res.json(await categoryModel.getCategoryById(id)).end();
})
router.post('/add',async (req,res)=>{
    const { category_name, subject_id} = req.body;
    const category = {
        category_name,
        subject_id
      };
    res.json(await categoryModel.addCategory(category)).end();
})

module.exports = router;