const express = require('express');
const router  = express.Router();
router.get('/',(req,res)=>{
    res.json('test').end();
})
module.exports = router;