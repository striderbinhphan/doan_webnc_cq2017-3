const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
require('express-async-errors') ;
const path = require('path')
const {userGuard, lecturerGuard} = require('./middlewares/auth.mdw')
app.use(express.json());
app.use(morgan('dev'));
app.get('/',function(req,res){
  res.json({
      message:'Hello from Online Courses API'
  });
})
app.use('/uploads',express.static(path.resolve(__dirname, './uploads')));
//work
app.use('/auth',require('./routes/auth.route'));
//work
app.use('/courses',require('./routes/course.route'));

app.use('/subcribers',require('./routes/coursesubscribe.route'));
//work
app.use('/sections',require('./routes/section.route'));
//work
app.use('/users',userGuard,require('./routes/user.route'));
//work
app.use('/videos',require('./routes/video.route'));
//work
app.use('/watchlists',require('./routes/watchlist.route'));




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