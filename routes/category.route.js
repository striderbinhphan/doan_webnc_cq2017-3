const express = require("express");
const categoryModel = require("../models/category.model");
const router = express.Router();
router.get("/", async (req, res) => {
  const page = +req.query.page;
  const result = await categoryModel.allCategory(page);
   if(result.length === 0){
       return res.status(204).end();
   }
    res.status(200).json((result)).end();
});
router.get("/:id", async (req, res) => {
  const id = +req.params.id;
  const result = await categoryModel.getCategoryById(id);
   if(result.length === 0){
       return res.status(204).end();
   }
    res.status(200).json((result)).end();
});
router.post("/add", async (req, res) => {
  const { category_name, subject_id } = req.body;
  const category = {
    category_name,
    subject_id,
  };
  res.json(await categoryModel.addCategory(category)).end();
});

module.exports = router;
