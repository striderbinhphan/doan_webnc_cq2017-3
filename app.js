const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
require('express-async-errors') ;

app.use(express.json());
app.use(morgan('dev'));
app.get('/',function(req,res){
  res.json({
      message:'Hello from sakila API'
  });
})

app.use('/auth',require('./routes/auth.route'));
app.use('/user',require('./middlewares/auth.mdw'),require('./routes/user.route'));
app.use('/student',require('./routes/student.route'));


app.use('/err',function(req,res){
  throw new Error('Error!');
})
app.use((req,res,next)=>{
  res.status(400).json({
    error: "endpoint not found!"
  });
})
app.use((err,req,res,next)=>{
  console.error(err.stack)
  res.status(500).json({error_message:"something_broke"});
})

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
});